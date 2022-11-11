const express = require('express');
const router = express.Router();
const { videoModel } = require('../models/video.model');
const common = require('../common');

router.get('/', async (req, res) => {
  // クエリパラメータが指定された場合、検索
  if (Object.keys(req.query).length) {
    const ret = await videoModel.getByQuery(req.query);
    return ret === undefined
      ? res.status(404).json([]).end()
      : res.status(200).json(common.convertCamelToSnake(ret)).end();
  }
  // 全て取得
  const ret = await videoModel.getAll();
  res.status(200).json(common.convertCamelToSnake(ret)).end();
});

router.get('/:id', async (req, res) => {
  const ret = await videoModel.getById(req.params.id);
  return ret === undefined
    ? res.status(404).json([]).end()
    : res.status(200).json(common.convertCamelToSnake(ret)).end();
});

router.post('/', async (req, res) => {
  await videoModel.create(req.body);
  res.status(201).end();
});

router.patch('/:id', async (req, res) => {
  await videoModel.update(req.params.id, req.body);
  const ret = await videoModel.getById(req.params.id);
  res.status(200).json(common.convertCamelToSnake(ret)).end();
});

router.delete('/:id', async (req, res) => {
  const ret = await videoModel.remove(req.params.id);
  return ret > 0 ? res.status(204).end() : res.status(404).end();
});

module.exports = router;
