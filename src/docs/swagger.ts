import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Elixir',
            version:'1.0.0',
            description:'Project Management Application'
        },
        servers: [
            {
                url:process.env.APP_URL,
                description:'server'
            }
        ]
    },
    apis:['./src/routes/*.ts','./src/docs/schema/*.yaml']
}


export const swaggerSpec = swaggerJsdoc(options)
