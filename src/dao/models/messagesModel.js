import mongoose from 'mongoose';

const collection = "messages";

const messagesSchema = new mongoose.Schema({
    user : String, //correo del usuario
    message : String
})

const messagesModel = new mongoose.model(collection,messagesSchema);


export default messagesModel;