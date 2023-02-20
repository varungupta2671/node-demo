

'use strict';

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');

exports.plugin = {
    name: 'swagger-plugin',

    register: async (server) => {
        const swaggerOptions = {
            info: {
                title: 'AllTask APIs',
                version: Pack.version
            },
            documentationPage: process.env.NODE_ENV !== 'production'
        };
        let swagger = [];
        if(process.env.NODE_ENV === 'production'){
            
        }
        else{
            swagger = [
                Inert,
                Vision,
                {
                    plugin: HapiSwagger,
                    options: swaggerOptions
                }
            ]
        }
        
        await server.register(
            swagger
        );
        winston.info('Swagger Loaded');
    }
};
