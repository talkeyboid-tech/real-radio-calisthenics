const chai = require('chai');
const chaiHttp = require('chai-http');
// const expect = require('chai').expect;
const { setupServer } = require('../src/server');

// テストの前処理後処理で利用するknex
const config = require('../knexfile');
const knex = require('../src/knex')(config);

// モデル読込
const { HOGE_TABLE } = require('../src/models/hoge.model');
const { VIDEOS_TBL } = require('../src/models/video.model');

// 期待データ読込
const VIDEOS_JSON = require('./videosTableForTest.json');

chai.use(chaiHttp);
chai.should();

const NEW_IDS = ['XXX', 'YYY', 'ZZZ'];
const NOT_EXIST_IDS = ['AAA', 'BBB', 'CCC'];
const NOT_EXIST_TITLES = ['nt8BjJ8Y8s8u', 'JtEy3YCMDt4V', 'Pkc7BMHtuL8F'];

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
      it('動画情報一覧を取得する HTTP200', async () => {
        const res = await request.get('/videos');
        res.should.have.status(200);
        res.body.should.to.deep.equal(VIDEOS_JSON);
      });
      it('クエリパラメータでIDを指定し動画情報を取得する HTTP200', async () => {
        const query = { id: VIDEOS_JSON[2].id };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('クエリパラメータでタイトルを指定し動画情報を取得する HTTP200', async () => {
        const query = { title: VIDEOS_JSON[2].title };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('クエリパラメータでIDを指定し動画情報を取得できなかった場合ステータスコード404が返却される HTTP404', async () => {
        const query = { id: NOT_EXIST_IDS[0] };
        const res = await request.get('/videos').query(query);
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
      it('クエリパラメータでタイトルを指定し動画情報を取得できなかった場合ステータスコード404が返却される HTTP404', async () => {
        const query = { title: NOT_EXIST_TITLES[0] };
        const res = await request.get('/videos').query(query);
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
    });

    describe('GET /videos/:id', () => {
      it('パスパラメータでIDを指定し動画情報を取得する HTTP200', async () => {
        const res = await request.get(`/videos/${VIDEOS_JSON[2].id}`);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('パスパラメータでIDを指定し動画情報を取得できなかった場合空配列を取得する HTTP404', async () => {
        const res = await request.get('/videos/a');
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
    });

    describe('POST /videos', () => {
      afterEach(async () => {
        await knex.from(VIDEOS_TBL).where('id', '=', NEW_IDS[0]).del();
      });

      it('動画情報を追加するとステータスコード201が返却される HTTP201', async () => {
        const res = await request.post('/videos').send({
          id: NEW_IDS[0],
          title: 'テストタイトル',
          description: 'テスト詳細',
          view_count: 10,
          like_count: 20,
        });
        res.should.have.status(201);
      });
    });

    describe('PATCH /videos/:id', () => {
      beforeEach(async () => {
        await knex
          .insert({
            id: NEW_IDS[0],
            title: 'テストタイトル',
            description: 'テスト詳細',
            view_count: 10,
            like_count: 20,
          })
          .into(VIDEOS_TBL);
      });

      afterEach(async () => {
        await knex.from(VIDEOS_TBL).where('id', NEW_IDS[0]).del();
      });

      it('動画情報を変更すると変更された動画情報が返却される HTTP200', async () => {
        const expectBody = {
          id: NEW_IDS[0],
          title: 'テストタイトル変更後',
          description: 'テスト詳細',
          view_count: 10,
          like_count: 20,
        };
        const res = await request
          .patch(`/videos/${NEW_IDS[0]}`)
          .send({ title: 'テストタイトル変更後' });
        res.should.have.status(200);
        res.body.should.to.deep.equal([expectBody]);
      });
    });

    describe('DELETE /videos/:id', () => {
      before(async () => {
        await knex
          .insert({
            id: NEW_IDS[0],
            title: 'テストタイトル',
            description: 'テスト詳細',
            view_count: 10,
            like_count: 20,
          })
          .into(VIDEOS_TBL);
      });

      it('動画情報を削除するとステータスコード204が返却される HTTP204', async () => {
        const res = await request.delete(`/videos/${NEW_IDS[0]}`);
        res.should.have.status(204);
      });

      it('削除対象の動画情報がなかった場合ステータスコード404が返却される HTTP404', async () => {
        const res = await request.delete(`/videos/${NEW_IDS[1]}`);
        res.should.have.status(404);
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
