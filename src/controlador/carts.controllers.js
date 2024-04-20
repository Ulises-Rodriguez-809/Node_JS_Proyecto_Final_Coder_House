import jwt from 'jsonwebtoken';
import { cartService, ticketService } from '../respository/index.repository.js';
import { emailSender } from '../utils.js';
import { CustomError } from '../services/customError.services.js';
import { ERRORS } from '../enum/error.js';
import cartErrorOptions from '../services/cartError.js';
import ticketErrorOptions from '../services/ticketError.js';
import { generateSendEmailError } from '../services/emailSendError.js';

class CartsControllers {
    static getAllCarts = async (req, res, next) => {
        try {
            const result = await cartService.getAll();

            if (!result) {
                req.logger.warning("Error, no se logro obtener los carts");

                CustomError.createError({
                    name: "No se logro obtener todos los cart",
                    cause: cartErrorOptions.generateGettAllCartsError(),
                    message: "Error buscando todos los carts",
                    errorCode: ERRORS.CART_ERROR
                })
            }

            res.send({
                status: "success",
                message: result
            });

        } catch (error) {
            req.logger.error("No se logro obtener los carts");

            next(error);
        }
    }

    static getCartById = async (req, res, next) => {
        try {
            const id = req.params.cartId;

            const result = await cartService.getById(id);

            if (!result) {
                req.logger.warning(`Error, no se logro obtener el cart con el id : ${id}`);

                CustomError.createError({
                    name: "Cart no encontrado",
                    cause: cartErrorOptions.generateGetCartByIdError(id),
                    message: "Error buscando el cart",
                    errorCode: ERRORS.CART_ERROR
                })
            }

            res.send({
                status: "success",
                message: result
            });

        } catch (error) {
            req.logger.error("No se logro obtener obtener el cart por su ID");

            next(error);
        }
    }

    static addCart = async (req, res, next) => {
        try {
            const cart = await cartService.create();

            if (!cart) {
                req.logger.warning("No se logro crear un nuevo carrito");

                CustomError.createError({
                    name: "No se logro crear el cart",
                    cause: cartErrorOptions.generateCreateCartError(),
                    message: "Error al crear el carrito",
                    errorCode: ERRORS.PRODUCT_TO_CART_ERROR
                })
            }

            res.send({
                status: "success",
                cart
            });

        } catch (error) {
            req.logger.error("No se logro agregar el cart al usuario");

            next(error);
        }
    }

    static addProductToCart = async (req, res, next) => {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const { quantity } = req.body;

            const result = await cartService.add(cartId, productId, parseInt(quantity));

            if (typeof result === "string") {
                req.logger.warning(`Error, no se logro agregar al cart el producto con el id : ${productId}`);

                CustomError.createError({
                    name: "No se añadir el producto al cart",
                    cause: cartErrorOptions.generateAddProductToCartError(productId, cartId),
                    message: result,
                    errorCode: ERRORS.CART_ERROR
                })

            }

            res.send({
                status: "success",
                message: result
            });

        } catch (error) {
            req.logger.error("No se logro agregar el producto al cart al usuario");

            next(error);
        }
    }

    static purchase = async (req, res, next) => {
        try {
            const cartId = req.params.cartId;

            const result = await ticketService.create(cartId);

            if (!result) {
                req.logger.error("No se logro crear el ticket");

                CustomError.createError({
                    name: "No se logro crear el ticket",
                    cause: ticketErrorOptions.generateCreateTicketError(),
                    message: "La compra no se logro hacer con exito",
                    errorCode: ERRORS.TICKET_ERROR
                })
            }

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { full_name, email } = decodedToken;

            const { code, purchase_datetime, amount, purchaser } = result.ticket;

            const subject = "Ticket de compra"

            const template = `<div>
            <h1>Felicidades ${full_name}!!</h1>
            <p>Tu compra se realizo con exito</p>
            <div>
                <ul>
                    <li>tu codigo de compra es: ${code}</li>
                    <li>dia de confirmacion de compra: ${purchase_datetime}</li>
                    <li>total: ${amount}</li>
                    <li>comprador: ${purchaser}</li>
                </ul>
            </div>
            <div>
                <p>Ante cualquier duda comunicarce a nuestro atencio al cliente</p>
                <p>email : atencioCliente@gmail.com</p>
                <p>phone: +5555555555</p>
            </div>
            <a href="http://localhost:8080/">Ir a la pagina</a>
            </div>`;

            const respond = await emailSender(email, template, subject);

            if (!respond) {
                req.logger.warning("El ticket se creo con exito pero no se logro enviar el email");

                CustomError.createError({
                    name: "Error en el envio del email",
                    cause: generateSendEmailError(email),
                    message: "La compra se realizo con exito, pero no se logro enviar el email",
                    errorCode: ERRORS.EMAIL_SEND_ERROR
                })
            }

            res.send({
                status: "success",
                payload: result
            })

        } catch (error) {
            req.logger.error("No se logro crear el ticket");

            next(error);
        }
    }

    static updateCart = async (req, res, next) => {
        try {
            const cartId = req.params.cartId;
            const { products } = req.body;

            const result = await cartService.updateList(cartId, products);

            if (typeof result === "string") {
                req.logger.warning("No se logro actualizar el producto");

                CustomError.createError({
                    name: "No se logro actualizar el cart",
                    cause: cartErrorOptions.generateUpdateProductsListError(cartId),
                    message: result,
                    errorCode: ERRORS.CART_ERROR
                })

            }

            res.send({
                status: "success",
                message: result
            });

        } catch (error) {
            req.logger.error("Error al intentar actualizar el producto");

            next(error);
        }
    }

    static updateProductsQuantity = async (req, res, next) => {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const { quantity } = req.body;

            const result = await cartService.updateQuantity(cartId, productId, quantity);

            if (typeof result === "string") {
                req.logger.warning(`No se logro actializar la el producto con el id : ${productId} a la cantidad : ${quantity}`);

                CustomError.createError({
                    name: "No se logro actualizar la cantidad de los productos el cart",
                    cause: cartErrorOptions.generateUpdateProductQuantityError(cartId, productId, quantity),
                    message: result,
                    errorCode: ERRORS.CART_ERROR
                })

            }

            res.send({
                status: "success",
                message: result
            });

        } catch (error) {
            req.logger.error("Error al intentar actualizar la cantidad del producto");

            next(error);
        }
    }

    static clearCart = async (req, res, next) => {

        try {
            const id = req.params.cartId;

            const result = await cartService.deleteAll(id);

            if (typeof result === "string") {
                req.logger.warning(`No se logro eliminar los productos del cart ${id}`);
                
                CustomError.createError({
                    name: "No se limpiar cart",
                    cause: cartErrorOptions.generateDeleteCartProductsError(id),
                    message: result,
                    errorCode: ERRORS.CART_ERROR
                })

            }

            res.send({
                status: "success",
                message: `Los productos del cart: ${id} se eliminaron con exito`
            });

        } catch (error) {
            req.logger.error("error al intentar eliminar los prodcutos del cart");

            next(error);
        }
    }

    static deleteProductFromCart = async (req, res, next) => {

        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;

            const result = await cartService.deleteOne(cartId, productId);

            if (typeof result === "string") {
                req.logger.warning(`No se logro eliminar el producto : ${cartId} del cart : ${cartId}`);

                CustomError.createError({
                    name: "No se logro eliminar el producto del cart",
                    cause: cartErrorOptions.generateDeleteProductToCartError(cartId, productId),
                    message: result,
                    errorCode: ERRORS.CART_ERROR
                })

            }

            res.send({
                status: "success",
                message: `Se logro eliminar con exito el cart con el id: ${cartId}`
            });

        } catch (error) {
            req.logger.error("Error al eliminar un productos del cart");

            next(error);
        }
    }
}

export { CartsControllers }