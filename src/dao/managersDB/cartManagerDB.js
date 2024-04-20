import cartsModel from '../models/cartsModel.js';
import productsModel from '../models/productsModel.js' //el model de products es para el populate

export class CartManagerDB {

    getCarts = async () => {
        try {
            const carts = await cartsModel.find();

            return carts;

        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await cartsModel.findOne({ _id: id });

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {

        const cart = await cartsModel.create({});

        return cart;
    }

    addProductToCart = async (idCart, idProduct, quantity = 1) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${idCart} no existe`;
            }

            const product = await productsModel.findOne({ _id: idProduct });

            if (!product) {
                return `el producto con el id : ${idProduct} no existe`;
            }

            let productsInCart = cart.products; //este es el products q se crea a partier del cart model

            const indexProduct = productsInCart.findIndex(product => product.product._id.toString() === idProduct);

            if (indexProduct === -1) {
                const newProduct = {
                    product: idProduct,
                    quantity
                }

                cart.products.push(newProduct);
            }
            else {
                cart.products[indexProduct].quantity += quantity;

            }

            await cart.save();

            return cart;


        } catch (error) {
            console.log(error);
        }
    }

    updateProductsList = async (idCart,arryProducts) =>{
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${idCart} no existe`;
            }

            cart.products = arryProducts;

            await cart.save();

            const result = await cartsModel.findOne({ _id: idCart });

            return result;

        } catch (error) {
            console.log(error);
        }
    }

    updateProductQuantity = async (idCart, idProduct, quantity = 1)=>{
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${idCart} no existe`;
            }

            const product = await productsModel.findOne({ _id: idProduct });

            if (!product) {
                return `el producto con el id : ${idProduct} no existe`;
            }

            let productsInCart = cart.products;

            const indexProduct = productsInCart.findIndex(product => product.product._id.toString() === idProduct);

            if (indexProduct === -1) {
                return `el producto con el id : ${idProduct} no se encuentra en el carrito`;

            }
            else {
                cart.products[indexProduct].quantity = quantity;

            }

            await cart.save();

            return cart;


        } catch (error) {
            console.log(error);
        }
    }

    deleteCartProducts = async (id) => {
        try {
            const cart = await cartsModel.findOne({ _id: id });

            if (!cart) {
                return `el carrito con el id : ${id} no existe`;
            }

            cart.products = [];

            await cart.save();

            return true

        } catch (error) {
            console.log(error);
        }
    }

    deleteProductToCart = async (idCart, idProduct) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${id} no existe`;
            }

            const product = await productsModel.findOne({ _id: idProduct });

            if (!product) {
                return `el producto con el id : ${idProduct} no existe`;
            }

            let productsInCart = cart.products;

            const indexProduct = productsInCart.findIndex(product => product.product._id.toString() === idProduct);

            if (indexProduct > -1) {
                cart.products.splice(indexProduct,1);
            }

            await cart.save();

            return true;

        } catch (error) {
            console.log(error);
        }
    }
}