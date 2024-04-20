import { v4 as uuidv4 } from "uuid";
import ticketModel from '../models/ticketModel.js';
import { CartManagerDB } from './cartManagerDB.js';
import { Users } from "./userManager.js";
import { ProductManagerDB } from "./productManagerDB.js";

const Product = new ProductManagerDB();
const Cart = new CartManagerDB();
const User = new Users();

export class TicketManager {
    async getTicket(email) {
        try {
            const ticket = await ticketModel.findOne({ purchaser : email }).lean();

            if (!ticket) {
                return "Ticket de compra no encontrado";
            }

            ticket["purchase_datetime"] = ticket["purchase_datetime"].replace(/ /g,"_");

            return ticket;

        } catch (error) {
            console.log(error.message);
        }
    }

    async updateProductsStock(arrayProducts){
        for (const item of arrayProducts) {
            const aux = await Product.getProductById(item.product.id);
    
            let stockUpdate = aux.stock - item.quantity;
    
            const isUpdated = await Product.updateProduct(aux._id, { stock: stockUpdate });
        }
    }

    async calculateAmount(arrayProducts){
        let totalAmount = 0;
    
        // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        for (const item of arrayProducts) {
            let amountProducts = item.quantity;
    
            let isStock = await Product.isInStock(amountProducts, item.product.id);
    
            if (isStock) {
                const product = await Product.getProductById(item.product.id);
    
                totalAmount += product.price * item.quantity;
            }
        }
    
        return totalAmount;
    }

    async purchesedProducts(cartId,arrayProducts) {
        try {
            let productsNotStock = [];
            let productsInStock = [];

            for (const item of arrayProducts) {
                let amountProducts = item.quantity;

                let isStock = await Product.isInStock(amountProducts, item.product.id);

                if (isStock) {
                    productsInStock.push(item);

                    await Cart.deleteProductToCart(cartId, item.product.id);

                }
                else {
                    productsNotStock.push({
                        id : item.product.id
                    });
                }
            }

            return {
                productsNotStock,
                productsInStock
            };

        } catch (error) {
            console.log(error.message);
        }
    }

    async createTicket(cartId) {
        try {
            const user = await User.getUser({ cart: cartId });
            const cart = await Cart.getCartById(cartId);

            if (!user) {
                return "Usuario no encontrado";
            }

            if (!cart) {
                return `No se encontro el cart con el id: ${cartId}`;
            }

            const code = uuidv4();
            let created_at = "";
            let amount = 0;
            const purchaser = user.email;

            const date = new Date();

            const [day, month, year] = [
                date.getDate(),
                date.getMonth(),
                date.getFullYear(),
            ];

            created_at = `dia: ${day}, mes: ${month + 1}, año: ${year}`;

            amount = await this.calculateAmount(cart.products);

            const { productsNotStock, productsInStock } = await this.purchesedProducts(cartId,cart.products);

            await this.updateProductsStock(productsInStock);

            const newTicket = {
                code,
                purchase_datetime: created_at,
                amount,
                purchaser
            }

            const result = await ticketModel.create(newTicket);

            return {
                ticket: result,
                notStock: productsNotStock
            };

        } catch (error) {
            console.log(error.message);
        }
    }
}