import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { transporter } from './config/gmail.js';
import { Faker, en } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { options } from './config/config.js';
import multer from 'multer';
import { productService } from './respository/index.repository.js';
import { ProductManagerDB } from './dao/managersDB/productManagerDB.js';

export const customFaker = new Faker({
    locale: [en]
});

const { commerce, image, database, string } = customFaker;

export const generateProductMocking = () => {
    const newProduct = {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        code: string.uuid(),
        stock: parseInt(string.numeric(Math.floor(Math.random() * 2 + 1))),
        category: commerce.department(),
        status: true,
        thumbnails: [image.url()]
    }

    return newProduct;
}

export const productsStock = async (array) => {
    const Product = new ProductManagerDB();

    let productsNotStock = [];
    let productsInStock = [];

    for (const item of array) {

        let amountProducts = item.quantity;
        let { product } = item;
        let isStock = await productService.isInStock(amountProducts, product.id);

        const { id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails } = product;

        let aux = {
            id,
            quantity : amountProducts,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }

        if (isStock) {
            productsInStock.push(aux);
        }
        else {
            productsNotStock.push(aux);
        }
    }

    return {
        productsNotStock,
        productsInStock
    };
}

export const createTicketsArray = (array)=>{
    const result = [];
    
    // esto xq la prop __v:0 q viene de la db hace q handlebars tire error
    for (let element of array) {
        const { id, code, purchase_datetime, amount, purchaser } = element;

        const aux = {
            id,
            code,
            purchase_datetime,
            amount,
            purchaser,
        }

        result.push(aux);
    }

    return result;
}


// multer
// genera el lugar de guardado
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //cb = callback
        // aca dependiedo del file q te llegue
        // ejem caso una img de perfil (.png, .jpg, etc)
        // lo guardas en una carpeta llamada profile
        // si es una img de producto en una carpeta llamada proeducto
        const { fieldname, mimetype } = file;

        if (mimetype.includes("/pdf") || mimetype.includes("/docx") || mimetype.includes("/xlsx") || mimetype.includes("/pptx")) {
            cb(null, `${__dirname}/public/documents`);
        }
        else if (mimetype.includes("/jpg") || mimetype.includes("/png") || mimetype.includes("/gif") || mimetype.includes("/tif") || mimetype.includes("/bmp") || mimetype.includes("/svg") || mimetype.includes("/jpeg")) {

            // fieldname te trae el nombre del input donde se subieron las iamgen, usa eso para saber si lo q se manda a multer es una imagen de un producto o otro tipo de imagen
            // esto te es util ya q el nombre de la imagen puede ser cualquier cosa por lo caul usas el input name para saber en q carpeta guardar
            if (fieldname.includes("thumbnails")) {
                cb(null, `${__dirname}/public/images/products`);
            } else {
                cb(null, `${__dirname}/public/images/profiles`);
            }
        }
        else {
            cb(null, `${__dirname}/public/videos`);
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const uploader = multer({ storage });

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salts);
}

export const isValidPassword = async (password, user) => await bcrypt.compare(password, user.password);

export const emailSender = async (email, template, subject = "Atencion al cliente") => {
    try {

        const contenido = await transporter.sendMail({
            //Estructura del correo
            from: "e-commerce-Ulises",
            to: email,
            subject,
            html: template
        })

        return true;

    } catch (error) {
        console.log(error.message);

        return false;
    }
}

export const generateEmailToken = (email, expireTime) => {
    //pasale 1 minuto para hacer q el token expire rapido y probarlo, despues cambialo a 1 hora 3600 
    const token = jwt.sign({ email }, options.EMAIL_TOKEN, { expiresIn: expireTime });

    return token;
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, options.EMAIL_TOKEN);

        return info.email;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;