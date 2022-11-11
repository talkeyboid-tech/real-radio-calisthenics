const chai = require('chai');
const chaiHttp = require('chai-http');
// const expect = require('chai').expect;
const { setupServer } = require('../src/server');

// テストの前処理後処理で利用するknex
const config = require('../knexfile');
const knex = require('../src/knex')(config);

// モデル読込
const { HOGE_TABLE } = require('../src/models/hoge.model');

// 期待データ読込
const VIDEOS_JSON = require('./videosTableForTest.json');

chai.use(chaiHttp);
chai.should();

const NEW_IDS = [999999, 1000000, 1000001];

describe('Solo API Server', () => {
  let request;
  beforeEach(() => {
    const server = setupServer();
    request = chai.request(server).keepOpen();
  });

  afterEach(() => {
    request.close();
  });

  describe('/videos', () => {
    describe('GET /videos', () => {
      it('videos一覧取得', async () => {
        const res = await request.get('/videos');
        res.should.have.status(200);
        res.body.should.to.deep.equal(VIDEOS_JSON);
      });
    });
  });

  xdescribe('Samples', () => {
    describe('GET /hello', () => {
      it('{greeting: hello} を返却する', async () => {
        const res = await request.get('/hello');
        res.should.have.status(200);
        res.body.should.to.deep.equal({ greeting: 'hello' });
      });
    });

    describe('GET /hoge', () => {
      it('hoge一覧取得', async () => {
        const res = await request.get('/hoge');
        res.should.have.status(200);
        res.body.should.to.deep.equal([
          { id: 1, name: 'hoge' },
          { id: 2, name: 'fuga' },
          { id: 3, name: 'foo' },
        ]);
      });
    });

    describe('GET /hoge/:id', () => {
      it('idを指定してhogeを取得', async () => {
        const res = await request.get('/hoge/3');
        res.should.have.status(200);
        res.body.should.to.deep.equal([{ id: 3, name: 'foo' }]);
      });
      it('idを指定してhogeを取得できなかった場合、空配列を返却', async () => {
        const res = await request.get('/hoge/1000');
        res.should.have.status(200);
        res.body.should.to.deep.equal([]);
      });
    });

    describe('POST /hoge', () => {
      after(async () => {
        await knex
          .from(HOGE_TABLE)
          .where('id', NEW_IDS[0])
          .del()
          .catch(console.error);
      });

      it('hogeを追加すると採番されたidが返ってくる', async () => {
        const res = await request
          .post('/hoge')
          .send({ id: NEW_IDS[0], name: 'newName' });
        res.should.have.status(201);
        res.body.should.to.be.equal(NEW_IDS[0]);
      });
    });

    describe('DELETE /hoge', () => {
      before(async () => {
        await knex
          .insert({ id: NEW_IDS[0], name: 'newName' })
          .into(HOGE_TABLE)
          .returning('id');
      });

      it('hogeを削除するとxxxxxx', async () => {
        const res = await request.delete(`/hoge/${NEW_IDS[0]}`);
        res.should.have.status(204);
      });
    });

    describe('PATCH /hoge/:id', () => {
      before(async () => {
        await knex
          .insert({ id: NEW_IDS[0], name: 'newName' })
          .into(HOGE_TABLE)
          .returning('id');
      });

      after(async () => {
        await knex
          .from(HOGE_TABLE)
          .where('id', NEW_IDS[0])
          .del()
          .catch(console.error);
      });

      it('hogeを変更すると変更後のオブジェクトが返ってくる', async () => {
        const res = await request
          .patch(`/hoge/2`)
          .send({ name: 'newNamePatched' });
        res.should.have.status(204);
      });
    });
  });
});
