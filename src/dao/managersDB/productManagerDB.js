import productsModel from '../models/productsModel.js';

export class ProductManagerDB {
    getProducts = async (query, options) => {
        try {
            const products = await productsModel.paginate(
                {
                    ...query
                },
                {
                    ...options
                }
            )

            // ESTO DE ACA ES XQ EL VALUE DE LOS INPUTS TE TOMA SOLO LA PRIMERA PALABRA DEL ARRAY
            // OSEA SI VOS EN LA DB TENES "CAFE RICO" EL VALUE DEL INPUT TE TOMA SOLO "CAFE"
            products.docs.forEach(product => {
                product["title"] = product["title"].replace(/ /g, "_");
                product["description"] = product["description"].replace(/ /g, "_");
            });

            return {
                status: "success",
                payload: products
            }

        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (id) => {
        try {
            const product = await productsModel.findOne({ _id: id });

            if (product === null) {
                return `No se encontro el producto con el id: ${id}`;

            } else {
                return product;
            }

        } catch (error) {
            console.log(error);
        }
    }

    isInStock = async (amount, id) => {
        try {
            const product = await this.getProductById(id);

            if (!product) {
                return false
            }

            if (parseInt(amount) > product.stock) {
                return false
            }

            return true

        } catch (error) {
            console.log(error.message);
        }
    }

    addProduct = async (fields) => {
        const { title,
            description,
            code,
            price,
            status = true,
            stock,
            category,
            thumbnails = [],
            owner } = fields;


        if (!title || !description || !code || !price || !stock || !category || !owner) {
            return "Valores incompletos";
        }

        let newProduct = {};

        const productFind = await productsModel.findOne({ code: code });

        if (productFind) {
            return "El codigo del producto ya se encuentra en uso";
        }

        newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
            owner
        }

        await productsModel.create(newProduct);

        return newProduct;
    }

    updateProduct = async (id, fields) => {
        try {

            const updateProduct = {
                ...fields
            }

            const result = await productsModel.updateOne({ _id: id }, { $set: updateProduct });

            if (result["modifiedCount"] === 1) {
                return true;

            } else {
                // para porbar esto en postman el id debe de ser el mismo largo q los id q te genera mongo
                //y tiene q ser hexadecimal [0...9], [a..f] y [A...F]:
                //657f7256adc125700f39a8cJKL --> esto va a dar error ya q no existe hexadecimal para J,K,L
                return `No se logro modificar el producto con el id: ${id}`;
            }

        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (id) => {
        try {

            const result = await productsModel.deleteOne({ _id: id });

            if (result["deletedCount"] === 0) {
                return `No se logro eliminar el producto con el id: ${id}`;

            } else {
                return true;
            }

        } catch (error) {
            console.log(error);
        }

    }

}