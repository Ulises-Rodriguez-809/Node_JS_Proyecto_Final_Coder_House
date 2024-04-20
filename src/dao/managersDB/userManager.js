import userModel from '../models/userModel.js';
import {CartManagerDB} from './cartManagerDB.js';

const Cart = new CartManagerDB();

export class Users {
    getAllUsers = async () => {
        let users = await userModel.find();

        return users;
    }

    saveUser = async (user) => {
        const newCart = await Cart.createCart();

        const newUser = {
            ...user,
            cart : newCart._id
        }

        let result = await userModel.create(newUser);

        return result;
    }

    getUser = async (params) => {

        let result = await userModel.findOne(params);

        return result;
    }

    updateUser = async (id, user) => {
        // como lo q me trae es un objeto
        delete user._id; //borro la referencia
        // esto se hace para checkear y no arriesgarte a pisar todos los usuarios

        let result = await userModel.updateOne({_id:id},{$set:user}) //1. filtrado sobre q registro quiero trabajar 2. la info q quiero guardar

        return result;
    }
}