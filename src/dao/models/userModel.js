import mongoose from 'mongoose';

const collection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true
    },
    rol: {
        type: String,
        enum: ["user", "premium", "admin"],
        default: "user"
    },
    documents: [
        {
            name: String, //nombre del documento
            reference: String//path donde esta guardado el documento
        }
    ],
    last_connection: {
        login: {
            type: String,
            default: ""
        },
        logout: {
            type: String,
            default: ""
        }
    }
})

userSchema.pre("find", function () {
    this.populate("cart");
})

userSchema.pre("findOne", function () {
    this.populate("cart");
})

const userModel = mongoose.model(collection, userSchema);

export default userModel;