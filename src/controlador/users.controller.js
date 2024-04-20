import jwt from 'jsonwebtoken';
import { userService } from '../respository/index.repository.js';
import {options} from '../config/config.js'

class UsersControllers{
    static premiumUser = async (req, res) => {
        try {
            // obtener el userId por el form de premium.handlebars es medio al pedo ya q antes ya podias obtener el rol del usuario pero como para la practica integradora piden q el enpoint sea /premium/:userId pues tenes q hacerlo de esta manera
            const userId = req.params.userId;
            const { rol } = req.body;

            console.log(userId);
            console.log(rol);

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

    static documents = async(req,res)=>{
        try {

            const files = req.files;

            // corroboro q se cargaron 3 archivos
            if (files.length !== 3) {
                return res.status(400).send({
                    status : "error",
                    message : "La cantidad de documentos ingresados no coinciden con los pedidos"
                })
            }

            const docs = files.map(doc => {
                return {
                    name : doc.originalname,
                    reference : doc.path
                }
            })

            const tokenInfo = req.cookies["jwt-cookie"];
            const decodedToken = jwt.decode(tokenInfo);

            const userInfo = await userService.getWhitoutFilter(decodedToken);

            userInfo.documents.push(...docs);

            const userUpdated = await userService.update(userInfo.id, userInfo);

            if (userUpdated.modifiedCount === 1) {
                return res.send({
                    status : "success",
                    message : "Archivos cargados con exito"
                })
            }

            res.status(500).send({
                status : "error",
                message : "No se logro cargar los documentos"
            })

        } catch (error) {
            res.status(500).send({
                status : "error",
                message : "No se logro cargar los documentos"
            })
        }
    }
}



export {UsersControllers};