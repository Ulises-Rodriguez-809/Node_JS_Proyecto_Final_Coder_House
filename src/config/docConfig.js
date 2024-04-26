import __dirname from '../utils.js';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
    definition : {
        openapi : "3.0.1",
        info : {
            title : "Documentaion del proyecto final",
            version : "1.0.0",
            description : "Documentacion sobre el proyecto final de coderhouse back-end"
        }
    },
    apis : [`${path.join(__dirname,"/docs/**/*.yaml")}`],
}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions);