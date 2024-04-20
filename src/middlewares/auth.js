import jwt from 'jsonwebtoken';
// import {options} from '../config/config.js';

export const checkRole = (roles)=>{
    return (req,res,next)=>{

        const tokenInfo = req.cookies["jwt-cookie"];

        const decodedToken = jwt.decode(tokenInfo);

        if(!decodedToken){
            return res.status(404).json({
                status:"error", 
                message:"necesitas inciar sesion"
            });
        }
        
        if(!roles.includes(decodedToken.rol)){
            return res.status(401).json({
                status:"error", 
                message:"no tenes los permisos necesarios para entrar"});
        }

        next();
    }
}

// se encarga de comprobar q el token no este expirado
export const verifyEmailTokenMW = (req,res,next)=>{
    console.log("entro verifyEmailTokenMW");
    return (req,res,next)=>{
            // tomamos el token q recivimos de la request
            // lo tomamos del query xq lo vamos a mandar por la url en el link del emial
            const tokenInfo = req.query.token;

            if (!tokenInfo) {
                return res.json({
                    status : "error",
                    message : "El token no existe"
                })
            }

            // decodifico el token
            const decodedToken = jwt.decode(tokenInfo);

            console.log(decodedToken);

            // obtenemos el tiempo de expiracion del token
            const expireTime = decodedToken.exp * 1000;
            console.log(decodedToken.exp);
            console.log(expireTime);

            // lo formateamos usando el objeto Date
            const expDate = new Date(expireTime);

            // luego tomo la fecha actual
            const currentDate = new Date();

            // ahora los comparo
            if (currentDate > expDate) {
                res.render("recoverPassword",{message : "Token expirado"});

                // return res.json({
                //     status : "error",
                //     message : "El token a expirado"
                // })
            }

            // si todo esta bien se ejecuta el next

        next();
    }
    // return (req,res,next)=>{
    //     try {
    //         // tomamos el token q recivimos de la request
    //         // lo tomamos del query xq lo vamos a mandar por la url en el link del emial
    //         const tokenInfo = req.query.token;

    //         // decodifico el token
    //         const decodedToken = jwt.decode(tokenInfo);

    //         console.log(decodedToken);

    //         // obtenemos el tiempo de expiracion del token
    //         const expireTime = decodedToken.exp * 1000;
    //         console.log(decodedToken.exp);
    //         console.log(expireTime);

    //         // lo formateamos usando el objeto Date
    //         const expDate = new Date(expireTime);

    //         // luego tomo la fecha actual
    //         const currentDate = new Date();

    //         // ahora los comparo
    //         if (currentDate > expDate) {
    //             return res.json({
    //                 status : "error",
    //                 message : "El token a expirado"
    //             })
    //         }

    //         // si todo esta bien se ejecuta el next

    //     } catch (error) {
    //         return res.json({
    //             status : "error",
    //             message : "error en el token"
    //         })
    //     }

    //     next();
    // }
}