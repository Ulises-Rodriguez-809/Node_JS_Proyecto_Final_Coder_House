import nodemailer from "nodemailer";
import { options } from "./config.js";
import { emailSender } from "../utils.js";

//credenciales
// const adminEmail = options.EMAIL_TOKEN || "uliisesrodriguez809@gmail.com";
// const adminPass = options.EMAIL_PASSWORD || "msqccuubswmmxdzm";
const adminEmail = options.EMAIL_TOKEN;
const adminPass = options.EMAIL_PASSWORD;

//configurar el canal de comunicacion entre node y gmail
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

// funcion de recuperacion de contraseña
// esta fun se encarga de crear el link q se envia al email para recuperar la contraseña
// tambien por ese link viaja el token con el q vamos a hacer las comparaciones  y comprobaciones de : 
// 1- q si el token se modifica no permita seguir usando la app
// 2- q la persona q accedio a la vista de recuperacion de contraseña diga ser quien es
// 3- ver el tiempo de expiracion del token
export const sendRecoverPassword = async (email, token, hostname) => {
    // la info del token luego la obtenes en sessions.router.js (la logica en el controler) obteniendo la query y ahi te fijas 1-2-3
    // con este link el usuario cuando le da click lo redirecciona a la vista de resetPassword
    
    let link = "";

    if (hostname.includes("onrender")) {
        link = `https://node-proyecto-final.onrender.com/resetPassword?token=${token}`;
    }
    else if (hostname.includes("railway")) {
        link = `https://nodeproyectofinal-production.up.railway.app/resetPassword?token=${token}`;
    }
    else{
        link = `http://localhost:8080/resetPassword?token=${token}`;
    }

    const template = `
    <div>
        <h1>Solicitaste un cambio de contraseña!!</h1>
        <p>El siguiente link permitira restablecer tu contraseña</p>
        <a href="${link}">Restablecer contraseña</a>
    </div>
    `

    const subject = "Restablecer contraseña";

    const resultEmail = await emailSender(email, template, subject);

    return resultEmail;
}

export { transporter };