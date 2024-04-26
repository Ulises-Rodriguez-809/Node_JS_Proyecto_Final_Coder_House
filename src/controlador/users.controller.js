import jwt from 'jsonwebtoken';
import { userService } from '../respository/index.repository.js';
import { options } from '../config/config.js'
import { emailSender } from '../utils.js';

class UsersControllers {
    static getAllUsers = async (req, res) => {
        try {
            const users = await userService.getAllNoSensitiveInformation();

            if (!users) {
                return res.status(500).send({
                    status: "error",
                    payload: "No se logro obtener los usuarios"
                })
            }

            res.send({
                status: "success",
                payload: users
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                payload: "No se logro obtener los usuarios"
            })
        }
    }

    static getUser = async(req,res)=>{
        try {
            const userInfo = {
                email : req.params.userEmail
            };
            
            const user = await userService.get(userInfo);

            if (!user) {
                return res.status(500).send({
                    status : "error",
                    payload : "usuario no encontrado"
                })
            }

            res.send({
                status : "success",
                payload : user
            })

        } catch (error) {
            res.status(500).send({
                status: "error",
                payload: "No se logro obtener el usuario"
            })
        }
    }

    static premiumUser = async (req, res) => {
        try {
            // obtener el userId por el form de premium.handlebars es medio al pedo ya q antes ya podias obtener el rol del usuario pero como para la practica integradora piden q el enpoint sea /premium/:userId pues tenes q hacerlo de esta manera
            const userId = req.params.userId;
            const { rol } = req.body;

            if (!userId || !rol) {
                return res.status(500).send({
                    status: "error",
                    message: "No se logro darle el premium al usuario"
                })
            }

            const tokenInfo = req.cookies["jwt-cookie"];
            const decodedToken = jwt.decode(tokenInfo);

            const user = await userService.getWhitoutFilter(decodedToken);

            user.rol = rol;

            // const updateUser = await userService.update(user.id, user);
            const updateUser = await userService.update(userId, user);

            res.clearCookie(options.COOKIE_WORD);

            res.send({
                status: "success",
                message: "Rol cambiado de USER a PREMIUM con exito"
            })

        } catch (error) {
            req.logger.error("No se logro cambiar el rol del usuario de : user a premium");

            res.status(400).send({
                status: "error",
                message: "Error al intentar modificar el rol del usuario"
            })
        }
    }

    static documents = async (req, res) => {
        try {

            const files = req.files;

            // corroboro q se cargaron 3 archivos
            if (files.length !== 3) {
                return res.status(400).send({
                    status: "error",
                    message: "La cantidad de documentos ingresados no coinciden con los pedidos"
                })
            }

            const docs = files.map(doc => {
                return {
                    name: doc.originalname,
                    reference: doc.path
                }
            })

            const tokenInfo = req.cookies["jwt-cookie"];
            const decodedToken = jwt.decode(tokenInfo);

            const userInfo = await userService.getWhitoutFilter(decodedToken);

            userInfo.documents.push(...docs);

            const userUpdated = await userService.update(userInfo.id, userInfo);

            if (userUpdated.modifiedCount === 1) {
                return res.send({
                    status: "success",
                    message: "Archivos cargados con exito"
                })
            }

            res.status(500).send({
                status: "error",
                message: "No se logro cargar los documentos"
            })

        } catch (error) {
            res.status(500).send({
                status: "error",
                message: "No se logro cargar los documentos"
            })
        }
    }

    static adminChangeRolUser = async(req,res)=>{
        try {
            const {id,rol} = req.body;

            const auxArray = ["admin","user","premium"];

            if (!auxArray.includes(rol)) {
                return res.status(400).send({
                    status: "error",
                    payload: "El rol asignado debe ser alguna de las opciones :  admin | user | premium"
                })
            }
            
            const usersRolUpdated = await userService.changeRol(id,rol);
            
            if (!usersRolUpdated) {
                return res.status(500).send({
                    status: "error",
                    payload: "No se logro obtener los usuarios"
                })
            }

            res.send({
                status : "success",
                payload : "El rol del usuario se modifico con exito"
            })

        } catch (error) {
            res.status(500).send({
                status: "error",
                message: "No se logro cargar los documentos"
            })
        }
    }

    static deleteUser = async(req,res)=>{
        try {
            const id = req.params.userId;

            const userDeleted = await userService.delete(id);

            if (!userDeleted) {
                return res.status(500).send({
                    status: "error",
                    message: `No se logro eliminar el usuario con el id : ${id}`
                })
            }

            res.send({
                status : "success",
                payload : `Usuario con el id : ${id} eliminado con exito`
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                message: "No se logro eliminar el usuario"
            })
        }
    }

    static deleteInactiveUsers = async (req, res) => {
        try {
            const users = await userService.getAll();

            if (!users) {
                return res.status(500).send({
                    status: "error",
                    message: "No se logro obtener los usuarios"
                })
            }

            const template = "Tu cuenta fue eliminada ya q pasaste 2 dias inactivo en la pagina";
            const subject = "Cuenta eliminada";

            // obtengo la fecha actual
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; //esto por los meses de Date van de 0-11 y como le sumaste uno en session.controller aca tambien tenes q sumar 1
            const currentDay = currentDate.getDate();

            for (let user of users) {
                // obtengo la ultima ves q el usuario se deslogueo
                const logoutDate = user.last_connection.logout;

                // obtengo los numeros de dia,mes,año
                const logoutDateArray = logoutDate.split("-");
                const logoutDay = logoutDateArray["1"].split(":")[1];
                const logoutMonth = logoutDateArray["2"].split(":")[1];
                const logoutYear = logoutDateArray["3"].split(":")[1];

                // compruebo el año
                if (currentYear > logoutYear || currentMonth > logoutMonth || currentDay > logoutDay) {
                    const result = await userService.delete(user.id);

                    //si se borro el usuario envio mail
                    if (result) {
                        const email = emailSender(user.email, template, subject);
                    }
                }
            }

            res.send({
                status: "success",
                payload: "Usuarios inactivos eliminados"
            })
        } catch (error) {
            res.status(500).send({
                status: "error",
                message: "No se logro eliminar los usuarios inactivos de 2 dias"
            })
        }
    }
}



export { UsersControllers };