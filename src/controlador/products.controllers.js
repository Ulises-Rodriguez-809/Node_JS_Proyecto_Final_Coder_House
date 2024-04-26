import { ERRORS } from '../enum/error.js';
import { productService } from '../respository/index.repository.js';
import { CustomError } from '../services/customError.services.js';
import productErrorOptions from '../services/productError.js';
import jwt from 'jsonwebtoken';
import { emailSender } from '../utils.js';

class ProductsControllers {
    static getProductsPaginate = async (req, res, next) => {
        try {

            const { limit, page, sort, category, stock } = req.query;
            const query = {};

            const auxSort = `&sort=${sort}`;
            const auxCategory = `&category=${category}`;
            const auxStock = `&stock=${stock}`;

            const options = {
                limit: limit ?? 10,
                page: page ?? 1,
                sort: { price: sort === "asc" ? 1 : -1 },
                lean: true
            }

            if (category) {
                query.category = category;
            }
            else if (stock) {
                query.stock = parseInt(stock);
            }

            const result = await productService.getAll(query, options);

            if (!result) {
                req.logger.warning("No se logro obtener los productos");

                CustomError.createError({
                    name: "No se logro obtener los productos",
                    cause: productErrorOptions.generateGetAllProductsError(),
                    message: "Error buscando todos los productos",
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const totalPages = result["payload"]["totalPages"];

            if (page > totalPages) {
                // este return es para q el resto del codigo no se ejecute ya q si bien no influye en el funcionamiento por consola tira error
                // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                return res.status(400).send({
                    status: "error",
                    message: `El numero de pagina ingresado: ${page} no es correcto, con el limit: ${limit} el total de paginas disponibles es de : ${totalPages}, ingresar un page que se encuentre entre los valores de paginas totales`,
                    link: `http://localhost:8080/api/productsDB?limit=${options.limit}&page=1`
                });
            }

            // tema del LINK
            if (result["payload"].hasPrevPage) {
                result["payload"].prevLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["payload"].prevPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (result["payload"].hasNextPage) {
                result["payload"].nextLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["payload"].nextPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (typeof result !== "object") {
                res.status(400).send({
                    status: "error",
                    message: "Error no se encontro la DB"
                });

            } else {
                res.send({
                    status: "success",
                    result
                })
            }

        }
        catch (error) {
            req.logger.warning("error en la paginacion de los productos");

            next(error);
        }
    }

    static getProductById = async (req, res, next) => {
        try {
            const id = req.params.productId;

            if (!id) {
                req.logger.error(`El id esta vacio`);

                CustomError.createError({
                    name: "No se logro obtener el producto",
                    cause: productErrorOptions.generateGetProductByIdError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const result = await productService.getById(id);

            if (typeof result === "string") {
                req.logger.warning(`No se logro obtener el producto : ${id}`);

                CustomError.createError({
                    name: "No se logro obtener el producto",
                    cause: productErrorOptions.generateGetProductByIdError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            res.send({
                status: "success",
                message: result
            })

        } catch (error) {
            req.logger.error("Error al intentar obtener el producto por el id");

            next(error);
        }
    }

    static addProduct = async (req, res, next) => {
        try {

            // const fields = req.body;


            // esto tenes q ponerlo asi xq sino en el body te trae [Object: null prototype] en newProduct.js el fetch tenes q sacarle el header xq sino el multer no funciona y te trae el req.file como undefined, capaz poniendo otras props en el header se soluciona
            // [Object: null prototype] no te cambia nada se puede acceder a las props del producto igual pero queda raro verlo asi por eso el parse y stringify
            // ya q no lo estas volviendo string el fetch
            // https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
            const fields = JSON.parse(JSON.stringify(req.body));

            if (!fields) {
                req.logger.error("Campos incompletos");

                CustomError.createError({
                    name: "Campos incompletos",
                    cause: productErrorOptions.generateAddProductError(),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            // como el campo thumbnails ya no viene mas desde el body tenes q agregarlo
            fields.thumbnails = [...req.files];

            const result = await productService.add(fields);

            if (typeof result === "string") {
                req.logger.warning("No se logro añadir el producto");

                CustomError.createError({
                    name: "No se logro agregar el producto",
                    cause: productErrorOptions.generateAddProductError(),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })

            }

            res.send({
                status: "success",
                message: result
            })

        } catch (error) {
            req.logger.error("No se logro añadir el producto al cart");

            next(error);
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            // const fields = req.body;
            const id = req.params.productId;
            const fields = JSON.parse(JSON.stringify(req.body));
            
            let message = "";
            let result = "";

            if (!id || !fields) {
                req.logger.warning(`Los campos necesarios para actualizar el producto estan vacios`);

                CustomError.createError({
                    name: "No se logro actualizar el producto",
                    cause: productErrorOptions.generateUpdateProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            fields.thumbnails = [...req.files];

            const product = await productService.getById(id);

            const { owner } = product;

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            if (decodedToken.rol === "admin") {
                result = await productService.updateOne(id, fields);

                if (!result) {
                    message = `El admin NO logro modificar el producto con el id: ${id}`;
                    
                    return res.status(400).send({
                        status: "error",
                        message,
                    })
                }

                message = `El admin modifico el producto con el id: ${id}`;
            }
            else{
                const { email } = decodedToken;

                if (email === owner) {
                    result = await productService.updateOne(id, fields);

                    message = `El usuario premium : ${email} logro modificar con exito el producto que el creo con el id: ${id}`;

                }
                else {
                    message = `El usuario premium : ${email} no tiene permisos para modificar el producto con el id: ${id}`;

                    return res.status(400).send({
                        status: "error",
                        message,
                        payload: decodedToken.rol
                    })
                }
            }

            if (typeof result === "string") {
                req.logger.warning(`No se logro actualizar el producto : ${id}`);

                CustomError.createError({
                    name: "No se logro actualizar el producto",
                    cause: productErrorOptions.generateUpdateProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            res.send({
                status: "success",
                message: `Se modifico con exito el producto con el id: ${id}`
            })

        } catch (error) {
            req.logger.error("No se logro actualizar el producto");

            next(error);
        }
    }

    // agrega el envio de mail cuando el admin o el usuario premiunm eliminan un producto del usuario premiumn
    // solo al usuario del creador del product
    static deleteProduct = async (req, res, next) => {
        try {
            const id = req.params.productId;

            if (!id) {
                req.logger.error(`El id del producto llego vacio`);

                CustomError.createError({
                    name: "No se logro eliminar el producto",
                    cause: productErrorOptions.generateDeleteProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            let result = null;
            let message = "";

            const product = await productService.getById(id);

            const { owner } = product;

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            // si el rol es admin le dejo borrar el producto q el quiera
            if (decodedToken.rol === "admin") {
                result = await productService.deleteOne(id);

                if (!result) {
                    message = `El admin NO logro eliminar el producto con el id: ${id}`;
                    
                    return res.status(400).send({
                        status: "error",
                        message,
                    })
                }

                message = `El admin elimino el producto con el id: ${id}`;

            }
            // como el middleware checkrol se encarga dejarte acceder al endpoint solo si sos rol "premium" o "admin" no te tenes q preocupar de q te llegue otra cosa 
            else {
                const { email } = decodedToken;

                if (email === owner) {
                    result = await productService.deleteOne(id);

                    message = `El usuario premium : ${email} logro eliminar con exito el producto que el creo con el id: ${id}`;

                }
                else {
                    message = `El usuario premium : ${email} no tiene permisos para eliminar el producto con el id: ${id}`;

                    return res.status(400).send({
                        status: "error",
                        message,
                        payload: decodedToken.rol
                    })
                }
            }

            if (typeof result === "string") {
                req.logger.warning(`No se logro eliminar el producto : ${id}`);

                CustomError.createError({
                    name: "No se logro eliminar el producto",
                    cause: productErrorOptions.generateDeleteProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const sendEmail = await emailSender(owner, message, "Producto eliminado");

            res.send({
                status: "success",
                message,
                payload: decodedToken.rol
            })

        } catch (error) {
            req.logger.error("No se logro eliminar el producto de la DB");

            next(error);
        }
    }
}

export { ProductsControllers }