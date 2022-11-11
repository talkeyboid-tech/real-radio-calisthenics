const express = require('express');
// const _ = require("underscore");

const common = require('./common');
const hogeModel = require('./models/hoge.model');
const { videoModel } = require('./models/video.model');

const setupServer = () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/hello', (_, res) => {
    res.status(200).json({ greeting: 'hello' });
  });

  app.get('/hoge', async (_, res) => {
    const ret = await hogeModel.getAll(3);
    res.status(200).json(ret).end();
  });

  app.get('/hoge/:id', async (req, res) => {
    const ret = await hogeModel.getById(req.params.id);
    res.status(200).json(common.convertToArray(ret)).end();
  });

  app.post('/hoge', async (req, res) => {
    const id = await hogeModel.create(req.body);
    res.status(201).json(id).end();
  });

  app.delete('/hoge/:id', async (req, res) => {
    const ret = await hogeModel.remove(req.params.id);
    return ret > 0 ? res.status(204).end() : res.status(404).end();
  });

  app.patch('/hoge/:id', async (req, res) => {
    await hogeModel.update(req.params.id, req.body);
    res.status(204).end();
  });

  app.get('/videos', async (_, res) => {
    const ret = await videoModel.getAll();
    res.status(200).json(ret).end();
  });
  return app;
};

module.exports = { setupServer };
