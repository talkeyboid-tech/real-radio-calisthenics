const express = require('express');

const setupServer = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const videosRouter = require('./routes/videos');
  app.use('/videos', videosRouter);

  return app;
};

module.exports = { setupServer };
