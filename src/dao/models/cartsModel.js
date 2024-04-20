import mongoose from 'mongoose';

const collection = "carts";

const cartsSchema = new mongoose.Schema({
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "products",
                require : true
            },
            quantity : {
                type : Number,
                require : true,
                default : 1
            }
        }
    ]
})

// el pre es el middleware q te ejecuta en cada consulta (para evitar el laburo de vos en el cartManagerDB tener q poner .populate("products.product")) "find" el populate reemplaze el id del producto por toda la info del producto con ese id
cartsSchema.pre("find",function () {
    this.populate("products.product")
})

cartsSchema.pre("findOne",function () {
    this.populate("products.product")
})

const cartsModel = mongoose.model(collection,cartsSchema);

export default cartsModel;