import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

// esta es la colleccion q aparece en atlas
//es un array
const collection = "products";

//este es el formato de como se van a guardar los documentos q vayas creando
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    status: String,
    thumbnails: Array,
    owner: {
        type: String,
        default: "admin"
    }
})

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, productsSchema);

export default productsModel;