import winston from 'winston';
import {options} from '../config/config.js'
import path from 'path'
import __dirname from '../utils.js';

const currentEnviroment = options.NODE_ENV || "development";

// Crear un endpoint /loggerTest que permita probar todos los logs --> supongo q es un enpoint donde pones req.logger.info("error info"), req.logger.debug("error debug"), req.logger.fatal("error fatal"), etc y los mostras en un res.send o algo asi
// preguntalo por las dudas

const customLevels = {
    levels : {
        fatal : 0,
        error : 1,
        warning : 2,
        info : 3,
        http : 4,
        debug : 5
    },
    colors : {
        fatal : "red",
        error : "orange",
        warning : "yellow",
        info : "blue",
        http : "purple",
        debug : "green"
    }
}

const devLoggers = winston.createLogger({
    // con esto redefinimos los levels para q tome nuestros levels customizados
    levels : customLevels.levels,
    transports : [
        new winston.transports.Console({level : "debug"}), //recorda q la toma de errores va por orden, osea q si queres q te tome todos tenes q pasarle el nivel de error mas bajo
    ]
})

const prodLoggers = winston.createLogger({
    levels : customLevels.levels,
    transports : [
        // este para mostrar en consola
        new winston.transports.Console({level : "info"}),
        // este para guardar la info en el archvio
        new winston.transports.File({filename : path.join(__dirname, "/logs/error.log"), level : "info"}) //le pasamos la direccion exacta donde guardamos el archivo y el level para production
    ] 
})


const addLogger = (req,res,next)=>{
    if (currentEnviroment === "development") {
        // creamos el logger y lo agregamos al req
        req.logger = devLoggers
    }
    else{
        req.logger = prodLoggers
    }

    // disparo el logger para cualquier ruta q se ejecute
    req.logger.debug(`${req.url} - method : ${req.method}`);

    next();
}

export {addLogger};