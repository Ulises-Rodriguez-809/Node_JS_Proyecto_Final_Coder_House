import mongoose from 'mongoose';
import {options} from './config.js'

// const MONGO = process.env.MONGO_URL || "mongodb+srv://usersDB:1234@cluster0.ugjlygz.mongodb.net/ecommerce";
const MONGO = options.MONGO_URL;

export const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO);
    } catch (error) {
        console.log(`Hubo un error al tratar de conectar a la DB el error es: ${error}`);
    }
}