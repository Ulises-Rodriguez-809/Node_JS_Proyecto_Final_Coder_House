import { ERRORS } from "../enum/error.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case ERRORS.PRODUCT_ERROR:
            res.send({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        case ERRORS.CART_ERROR:
            res.json({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        case ERRORS.PRODUCT_TO_CART_ERROR:
            res.send({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        case ERRORS.TICKET_ERROR:
            res.send({
                status: "error",
                error: error.cause,
                message: error.message
            })

            break;

        default:
            res.send({
                status: "error",
                message: "Hubo un error, contacte con atencion del cliente"
            })

            break;
    }
}