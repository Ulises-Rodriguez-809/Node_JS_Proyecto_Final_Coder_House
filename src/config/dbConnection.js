import mongoose from 'mongoose';
import {options} from './config.js'

const MONGO = options.MONGO_URL;

export const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO);
    } catch (error) {
        console.log(`Hubo un error al tratar de conectar a la DB el error es: ${error}`);
    }
}