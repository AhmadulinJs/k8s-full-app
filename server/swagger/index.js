const router = require('express').Router();
const path = require('path');
const { setup } = require('chai-http-swagger');

const docsFilePath = path.resolve(__dirname, 'docs');
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'https://api.todo.com',
        description: 'TODO server'
      }
    ],
    info: {
      title: 'Todo app REST API',
      description: 'Todo app API Information'
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Please use login api to get accessToken'
        }
      }
    }
  },
  apis: [
    `/docs/*.yaml`,
  ]
};
const chaiHttpSwaggerOptions = {
  swagger: swaggerOptions,
  config: {
    swaggerPath: docsFilePath,
    fileName: 'todo_app',
    callerName: 'hr',
    format: 'yaml',
  }
};

const swagger = setup(chaiHttpSwaggerOptions).swagger;

router.use('/swagger', swagger);
module.exports = router;
