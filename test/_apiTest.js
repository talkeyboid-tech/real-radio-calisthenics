const chai = require('chai');
const chaiHttp = require('chai-http');
// const expect = require('chai').expect;
const { setupServer } = require('../src/server');

// テストの前処理後処理で利用するknex
const config = require('../knexfile');
const knex = require('../src/knex')(config);

// モデル読込
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
    describe('GET /', () => {
      it('HTTP200 動画情報一覧を取得する', async () => {
        const res = await request.get('/videos');
        res.should.have.status(200);
        res.body.should.to.deep.equal(VIDEOS_JSON);
      });
      it('HTTP200 クエリパラメータでIDを指定し動画情報を取得する', async () => {
        const query = { id: VIDEOS_JSON[2].id };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('HTTP200 クエリパラメータでタイトルを指定し動画情報を取得する', async () => {
        const query = { title: VIDEOS_JSON[2].title };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('HTTP404 クエリパラメータでIDを指定し動画情報を取得できなかった場合ステータスコード404が返却される', async () => {
        const query = { id: NOT_EXIST_IDS[0] };
        const res = await request.get('/videos').query(query);
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
      it('HTTP404 クエリパラメータでタイトルを指定し動画情報を取得できなかった場合ステータスコード404が返却される', async () => {
        const query = { title: NOT_EXIST_TITLES[0] };
        const res = await request.get('/videos').query(query);
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
    });

    describe('GET /:id', () => {
      it('HTTP200 パスパラメータでIDを指定し動画情報を取得する', async () => {
        const res = await request.get(`/videos/${VIDEOS_JSON[2].id}`);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('HTTP404 パスパラメータでIDを指定し動画情報を取得できなかった場合空配列を取得する', async () => {
        const res = await request.get('/videos/a');
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
    });

    describe('POST /', () => {
      afterEach(async () => {
        await knex.from(VIDEOS_TBL).where('id', '=', NEW_IDS[0]).del();
      });

      it('HTTP201 動画情報を追加するとステータスコード201が返却される', async () => {
        const res = await request.post('/videos').send({
          id: NEW_IDS[0],
          title: 'テストタイトル',
          description: 'テスト詳細',
          view_count: 10,
          like_count: 20,
        });
        res.should.have.status(201);
      });
      it('HTTP400 動画情報を追加したがIDがない場合エラーメッセージが返却される', async () => {
        const res = await request.post('/videos').send({
          title: 'テストタイトル',
          description: 'テスト詳細',
          view_count: 10,
          like_count: 20,
        });
        res.should.have.status(400);
        res.body.should.to.deep.equal({
          message: '必須項目がありません',
          required: 'id',
        });
      });
    });

    describe('PATCH /:id', () => {
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

      it('HTTP200 動画情報を変更すると変更された動画情報が返却される', async () => {
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

      it('HTTP400 動画情報を変更しようとしたが不正な項目が含まれている場合エラーメッセージが返却される', async () => {
        const res = await request.patch(`/videos/${NEW_IDS[0]}`).send({
          title: 'テストタイトル変更後',
          invalid: 'this is invalid',
        });
        res.should.have.status(400);
        res.body.should.to.deep.equal({
          message: '不正な項目が含まれています',
          invalid: 'invalid',
        });
      });
    });

    describe('DELETE /:id', () => {
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

      it('HTTP204 動画情報を削除するとステータスコード204が返却される', async () => {
        const res = await request.delete(`/videos/${NEW_IDS[0]}`);
        res.should.have.status(204);
      });

      it('HTTP404 削除対象の動画情報がなかった場合ステータスコード404が返却される', async () => {
        const res = await request.delete(`/videos/${NEW_IDS[1]}`);
        res.should.have.status(404);
      });
    });
  });
});
