import jwt from 'jsonwebtoken';
import { options } from '../config/config.js';
import { userService } from '../respository/index.repository.js';
import { createHash, emailSender, generateEmailToken, isValidPassword } from '../utils.js';
import { sendRecoverPassword } from '../config/gmail.js';

class SessionControler {
    static register = async (req, res) => {
        try {
            const { id, first_name, last_name, email } = req.user;

            const full_name = first_name.concat(" ", last_name);

            const subject = "Registro exitoso";

            const template = `<div>
            <h1>Bienvenido ${full_name}!!</h1>
            <h2>Tu id de usuario es: ${id}</h2>
            <p>No perder este id ya que te servira para poder obtener el rol premium en caso de quererlo</p>
            <img src="https://www.ceupe.com/images/easyblog_articles/3625/b2ap3_large_que-es-un-tienda-online.png" style="width:250px; height : 250px"/>
            <p>Ya puedes empezar a usar nuestros servicios</p>
            <div><a href="http://localhost:8080/">Ir a la pagina (localhost)</a></div>
            <div><a href="https://nodeproyectofinal-production.up.railway.app/">Ir a la pagina (railway)</a></div>
            <div><a href="https://node-proyecto-final.onrender.com/">Ir a la pagina (render)</a></div>
            </div>`;

            const respond = await emailSender(email, template, subject);

            if (!respond) {
                req.logger.warning("La registro se realizo pero no se logro enviar el email de confirmacion de esta");
            }

            res.send({
                status: "success",
                message: "Usuario registrado con exito",
                payload: req.user._id
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "Usuario ya registrado"
            })
        }
    }

    static failregister = async (req, res) => {
        req.logger.error("No se logro completar el registro del nuevo usuario con exito");

        res.status(400).send({
            status: "error",
            message: "No se logro el registro con exito"
        })
    }

    // upLogin puede usar el req.user xq lo estas llamando dentro del login, el cual cuenta con passport, el cual le agrega el req.user
    static updateLastLogin = async (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; //esto xq los meses los toma desde el 0-11
        const day = date.getDate();
        const hour = date.getHours();
        const minuts = date.getMinutes();
        const seconds = date.getSeconds();

        const last_login = `Hora: ${hour}:${minuts}:${seconds} - Dia: ${day} - Mes: ${month} - Año: ${year}`;

        req.user.last_connection.login = last_login;

        const userUpdated = await userService.update(req.user.id, req.user);

        return userUpdated;
    }

    // mientras q upLogout no puede usar req.user ya q loguot no cuenta con passport como middleware pero lo cual te va a dar error si intentas usarlo (recordatorio por el error del logout)
    static updateLastLogout = async (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours(); //render y railway guardan el horario 3 horas mas adelantedas del horario de argentina, supongo q es por donde estan los servidores q el objeto Date esta tomando el horario de donde este el server
        const minuts = date.getMinutes();
        const seconds = date.getSeconds();

        const last_logout = `Hora: ${hour}:${minuts}:${seconds} - Dia: ${day} - Mes: ${month} - Año: ${year}`;

        const tokenInfo = req.cookies["jwt-cookie"];

        const decodedToken = jwt.decode(tokenInfo);

        const userInfo = await userService.getWhitoutFilter(decodedToken);

        userInfo.last_connection.logout = last_logout;

        const userUpdated = await userService.update(userInfo.id, userInfo);

        return userUpdated;
    }

    static login = async (req, res) => {
        try {
            // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion 
            if (!req.user) {
                req.logger.error("Error, no se logro obtener los datos del usuario");

                return res.status(400).send({
                    status: "error",
                    message: "Usuario no encontrado"
                })
            }

            let user = {};

            const { first_name, last_name, age, email, password, cart, rol } = req.user;

            if (email === options.ADMIN_EMAIL && password === options.ADMIN_PASSWORD) {
                user = {
                    full_name: `${first_name} ${last_name}`,
                    age,
                    email,
                    rol: "admin"
                }

                req.logger.info("usuario con rol admin");

            }
            else {

                if (!first_name || !last_name || !age || !email || !password || !cart) {
                    req.logger.error("Error con los datos del usuario");

                    return res.status(400).send({
                        status: "error",
                        payload: "datos incompletos"
                    })
                }

                const userUpdated = await this.updateLastLogin(req, res);

                user = {
                    full_name: `${first_name} ${last_name}`,
                    age,
                    email,
                    rol,
                    cartID: cart._id
                }

                req.logger.info("usuario con rol user");

            }

            const token = jwt.sign(user, options.JWT_SECRET_WORD, { expiresIn: "2h" });

            // enviamos el token por la cookie
            // HttpOnly Cookies evitan que los scripts del lado del cliente accedan a estas cookies, reduciendo significativamente el riesgo de ataques XSS
            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 }).json({
                status: "success",
                payload: token
            })

        } catch (error) {
            req.logger.error("Error con los datos del usuario");

            res.status(400).send({
                status: "error",
                payload: "Usuario no encontrado"
            })
        }
    }

    static faillogin = async (req, res) => {
        req.logger.error("No se logro completar el login del usuario con exito");

        res.status(400).send({
            status: "error",
            payload: "fallo en el login"
        })

    }

    static githubcallback = async (req, res) => {
        try {
            if (!req.user) {
                req.logger.error("Error, usuario no encontrado");

                return res.status(400).send({
                    status: "error",
                    message: "Usuario no encontrado"
                })
            }

            const { first_name, last_name, age, email, rol, cart } = req.user;

            if (!first_name || !last_name || !age || !email || !cart) {
                req.logger.error("Error, no se logro obtener los datos del usuario desde github");

                return res.status(400).send({
                    status: "error",
                    payload: "datos incompletos"
                })
            }

            const user = {
                full_name: `${first_name} ${last_name}`,
                age,
                email,
                rol,
                cartID: cart._id
            }

            const token = jwt.sign(user, options.JWT_SECRET_WORD, { expiresIn: "2h" });

            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 })

            res.redirect("/home");

        } catch (error) {
            req.logger.error("No se encontro la cuenta de Github del usuario");

            res.status(400).send({
                status: "error",
                payload: "No se logro iniciar sesion con github"
            })
        }
    }

    static revocerPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const hostname = req.hostname;

            // para porbarlo ponele 60 segundos pero para el desafio ponele 3600
            const tokenEmail = generateEmailToken(email, 3600);

            const respond = await sendRecoverPassword(email, tokenEmail, hostname);

            if (!respond) {
                return res.status(400).send({
                    status: "error",
                    payload: "No se logro enviar el mail para restrablecer la contraseña"
                })
            }

            res.send({
                status: "success",
                payload: "email enviado con exito"
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "Usuario ya registrado"
            })
        }
    }

    static resetPassword = async (req, res) => {
        try {
            const { password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).send({
                    status: "error",
                    payload: "Las contraseñas no coinciden"
                });
            }

            const user = await userService.getWhitoutFilter(req.body);

            const samePassword = await isValidPassword(password, user);

            // si la contraseña es la misma q esta guardada en la DB, indicamos q no puede repetir la misma contraseña
            if (samePassword) {
                return res.status(400).send({
                    status: "error",
                    payload: "Error, esta contraseña ya fue usada anteriormente"
                });
            }

            const newPassword = await createHash(password);

            user.password = newPassword;

            const userUpdated = await userService.update(user._id, user);

            if (!userUpdated) {
                return res.status(400).send({
                    status: "error",
                    payload: "Error, no se logro actulizar los datos del usuario"
                });
            }

            res.send({
                status: "success",
                payload: "todo bien"
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "No se logro cambiar la contraseña"
            })
        }
    }

    static logout = async (req, res) => {
        try {

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { email } = decodedToken;

            if (email !== options.ADMIN_EMAIL) {
                // al igual q el update de last_login no te hace falta guardar el resultado del update pero como en el repository de user retornas algo, es para mantener la misma estrucura
                const userUpdated = await this.updateLastLogout(req, res);
            }

            if (req.cookies[options.COOKIE_WORD]) {

                res.clearCookie(options.COOKIE_WORD);

                req.logger.info("Cookie limpiada con exito");

                res.redirect('/');

            } else {
                req.logger.error("No se logro cerrar la sesion del usuario");

                res.status(401).send({
                    status: "error",
                    payload: "No se logro desloguear con exito"
                })
            }
        } catch (error) {
            res.status(500).send({
                status: "error",
                message: "No se logro cerrar sesion"
            })
        }
    }

    static current = async (req, res) => {
        try {
            if (!req.user) {
                req.logger.error("Error, usuario no encontrado");

                return res.status(401).send({
                    status: "error",
                    payload: "No se encontro el usuario"
                })
            }

            const userInfoDto = await userService.get(req.user);

            res.send({
                status: "success",
                payload: userInfoDto
            })

        } catch (error) {
            req.logger.error("Error, no se logro obtener los datos del usuario");

            res.status(400).send({
                status: "error",
                payload: "No se logro obtener los datos"
            })
        }
    }

    static failcurret = async (req, res) => {
        req.logger.warning("No se logro obtener los datos del usuario actual");

        res.status(400).send({
            error: "fallo en obtener los datos del usuario"
        })
    }
}

export { SessionControler };