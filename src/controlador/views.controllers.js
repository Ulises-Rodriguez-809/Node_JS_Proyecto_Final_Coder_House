import jwt from 'jsonwebtoken';
import { cartService, productService, userService, ticketService } from '../respository/index.repository.js';
import { createTicketsArray, productsStock } from '../utils.js';

class ViewsControllers {
    static login = (req, res) => {
        try {
            res.render("login");
        } catch (error) {
            req.logger.error("Error al intentar iniciar sesion");

            res.status(400).send({
                status: "error",
                msg: "No se concretar el logueo con exito"
            })
        }
    }

    static register = (req, res) => {
        try {
            res.render("register");
        } catch (error) {
            req.logger.error("Error al registrar un nuevo usuario");

            res.status(400).send({
                status: "error",
                msg: "No se logro completar el registro"
            })
        }
    }

    static recoverPass = (req, res) => {
        try {
            res.render("recoverPassword", { message: "No te preocupes nos sucede a todos!. Ingresa tu email y te ayudamos" });
        } catch (error) {
            req.logger.error("Error, no se logro obtener la vista para recuperar contraseña");

            res.status(400).send({
                status: "error",
                msg: "No se logro obtener la vista recoverPassword"
            })
        }
    }

    static resetPass = (req, res) => {
        try {

            const tokenInfo = req.query.token;

            res.render("resetPassword", { tokenInfo });
        } catch (error) {
            req.logger.error("Error, al intentar obtener la vista resetPassword");

            res.status(400).send({
                status: "error",
                msg: "No se logro obtener la vista resetPassword"
            })
        }
    }

    static home = async (req, res) => {
        try {
            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { full_name, rol, cartID } = decodedToken;

            const cartUrl = `/carts/${cartID}`;

            const user = {
                full_name,
                rol,
                cartUrl
            }

            res.render("home", { user });

        } catch (error) {
            req.logger.error("Error, al intentar obtener la vista Home");

            res.status(400).send({
                status: "error",
                msg: "No se logro obtener la vista Home"
            })
        }
    }

    static productsGet = async (req, res) => {
        try {
            const { limit, page } = req.query;

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { full_name, age, email, rol, cartID } = decodedToken;

            const cartUrl = `/carts/${cartID}`;

            const user = {
                full_name,
                age,
                email,
                rol,
                cartID,
                cartUrl
            }

            const query = {};
            const options = {
                limit: limit ?? 5,
                page: page ?? 1,
                lean: true
            }

            const result = await productService.getAll(query, options);

            const { payload } = result;

            res.render('products', { products: payload, user });

        } catch (error) {
            req.logger.warning("Datos del usuario incorrectos");

            res.status(400).send({
                status: "error",
                msg: "Datos del usuario incorrectos"
            })
        }
    }

    static cartId = async (req, res) => {
        try {
            const cartId = req.params.cartId;

            const cart = await cartService.getById(cartId);

            if (!cart) {
                return res.status(500).send({
                    status: "error",
                    payload: "No se encontro el cart"
                })
            }

            const { products } = cart;

            const inStock = [];
            const notStock = [];

            const listProductsStock = await productsStock(products);
            const {productsNotStock, productsInStock} = listProductsStock;

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { email } = decodedToken;

            let tickets = await ticketService.getAll(email);

            const auxTickets = createTicketsArray(tickets);
            
            res.render("cart", { products: productsInStock, notStock : productsNotStock, auxTickets });

        } catch (error) {
            req.logger.warning("No se logro encontrar el cart del usuario");
        }
    }

    static realtimeproducts = (req, res) => {
        try {

            let owner = "";

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { rol, cartID } = decodedToken;

            const cartUrl = `/carts/${cartID}`;

            if (rol === "admin") {
                owner = rol;
            }
            else {
                const email = decodedToken.email;
                owner = email;
            }

            const user = {
                owner,
                cartUrl
            }

            res.render('realTimeProducts', { user });

        } catch (error) {
            req.logger.fatal("No se logro acceder al apartado para agregar/actualizar/eliminar productos o no cuenta con los permisos necesarios");

            res.status(400).send({
                status: "error",
                msg: "No se encontraron los productos"
            })
        }
    }

    static premium = async (req, res) => {
        try {
            res.render("premium");
        } catch (error) {
            req.logger.error("Error, al intentar obtener la vista Premium");

            res.status(500).send({
                status: "error",
                message: "No se logro obtener la vista con el formulario para obtener el rol premium"
            })
        }
    }

    static currentUserProfile = async(req,res)=>{
        try {
            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { full_name, age, email, rol, cartID } = decodedToken;

            const cartUrl = `/carts/${cartID}`;

            res.render("profile",{cartUrl});
        } catch (error) {
            res.status(500).send({
                status : "error",
                payload : "No se logro renderizar el perfil del usuario"
            })
        }
    }

    static usersInfo = async (req, res) => {
        try {

            const users = await userService.getAllNoSensitiveInformation();

            res.render("users", { users });
        } catch (error) {
            req.logger.error("Error, al intentar obtener la vista usersInfo");

            res.status(500).send({
                status: "error",
                message: "No se logro obtener la vista con la informacion de todos los usuarios"
            })
        }
    }
}

export { ViewsControllers };