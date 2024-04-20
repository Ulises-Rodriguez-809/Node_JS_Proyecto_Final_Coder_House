import __dirname from '../utils.js';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';

// console.log(path.join(__dirname,"../docs/**/*.yaml"));
// console.log(path.join(__dirname,"/docs/**/*.yaml"));

const swaggerOptions = {
    definition : {
        openapi : "3.0.1",
        info : {
            title : "Desafio 10 documentaion del proyecto",
            version : "1.0.0",
            description : "Documentacion sobre el proyecto para el desafio entregable : Documentar API"
        }
    },
    apis : [`${path.join(__dirname,"/docs/**/*.yaml")}`],
}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);