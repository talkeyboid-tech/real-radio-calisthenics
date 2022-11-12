const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const setupServer = () => {
  // *** Setup Express ***
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/', express.static(`${__dirname}/public`));

  const videosRouter = require('./routes/videos');
  app.use('/videos', videosRouter);

  // *** Setup Swagger ***
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ラジオ体操動画API',
        version: '1.0.0',
        description: '全国各地のラジオ体操をやってみよう！',
        contact: {
          name: 'Yoshihiro Maeda',
          email: 'yoshihiro.maeda.cc@gmail.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/routes/videos.js', './docs/videos.yaml'],
  };

  const specs = swaggerJsdoc(options);

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );

  return app;
};

module.exports = { setupServer };
