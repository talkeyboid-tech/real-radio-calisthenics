const chai = require('chai');
const chaiHttp = require('chai-http');
const { setupServer } = require('../src/server');
const ip = require('ip');

// テストの前処理後処理で利用するknex
const config = require('../knexfile');
const knex = require('../src/knex')(config);

// モデル読込
const { VIDEOS_TBL } = require('../src/models/video.model');

// データ読込
// 期待値データ（全件）
const VIDEOS_JSON = require('./videosTableForTest.json');
// テスト利用データ
const fixtures = require('./video.fixtures');

chai.use(chaiHttp);
chai.should();

describe('Solo API Server', () => {
  let request;
  let newVideo;
  beforeEach(() => {
    const server = setupServer();
    request = chai.request(server).keepOpen();
    newVideo = fixtures.getNewVideo();
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
      it('HTTP200 クエリパラメータでタイトルを指定し動画情報を取得する(1件)', async () => {
        const query = { title: VIDEOS_JSON[2].title };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.deep.equal([VIDEOS_JSON[2]]);
      });
      it('HTTP200 クエリパラメータでタイトルを指定し動画情報を取得する(部分一致 2件)', async () => {
        const query = { title: 'テレビ体操' };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);
      });
      it('HTTP200 クエリパラメータで説明文を指定し動画情報を取得する(部分一致 2件)', async () => {
        const query = { description: '「ラジオ体操」図解' };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);
      });
      it('HTTP200 クエリパラメータで説明文を指定し動画情報を取得する(部分一致 1件)', async () => {
        const query = {
          description: '広島東洋カープやサンフレッチェ広島だけじゃない',
        };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(1);
      });
      it('HTTP200 クエリパラメータでlimitを指定すると指定したサイズの動画情報を取得する', async () => {
        const query = { limit: 10 };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(10);
      });
      it('HTTP200 クエリパラメータでタイトルとlimitを指定すると指定したサイズのタイトルが同じ動画情報を取得する', async () => {
        // 同じタイトルの動画を10件登録
        const ids = [];
        for (let i = 0; i < 10; i++) {
          const newId = Math.random().toString();
          ids.push(newId);
          newVideo.multipleExists.id = newId;
          await request.post('/videos').send(newVideo.multipleExists);
        }

        // limit指定で取得
        const query = { title: newVideo.multipleExists.title, limit: 5 };
        const res = await request.get('/videos').query(query);

        // アサーション
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(5);

        // 登録した動画情報を削除
        for (let i = 0; i < ids.length; i++) {
          await request.delete(`/videos/${ids[i]}`);
        }
      });
      it('HTTP200 クエリパラメータでoffsetを指定すると指定した位置からの動画情報を取得する', async () => {
        const query = { offset: 40 };
        const res = await request.get('/videos').query(query);
        const allVideos = await request.get('/videos');
        res.should.have.status(200);
        res.body.should.to.deep.equal(allVideos.body.slice(40));
      });
      it('HTTP200 クエリパラメータでlimitとoffsetを指定すると指定した位置から指定した件数の動画情報を取得する', async () => {
        const query = { limit: 10, offset: 20 };
        const res = await request.get('/videos').query(query);
        const allVideos = await request.get('/videos');
        res.should.have.status(200);
        res.body.should.to.deep.equal(allVideos.body.slice(20, 30));
      });
      it('HTTP200 クエリパラメータでタイトルとoffsetを指定すると指定したサイズのタイトルが同じ動画情報を取得する', async () => {
        // 同じタイトルの動画を10件登録
        const ids = [];
        for (let i = 0; i < 10; i++) {
          const newId = Math.random().toString();
          ids.push(newId);
          newVideo.multipleExists.id = newId;
          await request.post('/videos').send(newVideo.multipleExists);
        }

        // offset指定で取得
        const query = { title: newVideo.multipleExists.title, offset: 3 };
        const res = await request.get('/videos').query(query);

        // アサーション
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(7);

        // 登録した動画情報を削除
        for (let i = 0; i < ids.length; i++) {
          await request.delete(`/videos/${ids[i]}`);
        }
      });
      it('HTTP200 クエリパラメータでタイトルとlimitとoffsetを指定すると指定したサイズのタイトルが同じ動画情報を取得する', async () => {
        // 同じタイトルの動画を10件登録
        const ids = [];
        for (let i = 0; i < 10; i++) {
          const newId = Math.random().toString();
          ids.push(newId);
          newVideo.multipleExists.id = newId;
          await request.post('/videos').send(newVideo.multipleExists);
        }

        // limit, offset指定で取得
        const query = {
          title: newVideo.multipleExists.title,
          limit: 2,
          offset: 3,
        };
        const res = await request.get('/videos').query(query);

        // アサーション
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);

        // 登録した動画情報を削除
        for (let i = 0; i < ids.length; i++) {
          await request.delete(`/videos/${ids[i]}`);
        }
      });
      it('HTTP200 クエリパラメータで再生回数(以上)を指定すると指定した再生回数以上の動画情報を取得する', async () => {
        const query = { view_count_gt: 32420514 }; // NHKのみ2件
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);
      });
      it('HTTP200 クエリパラメータで再生回数(未満)を指定すると指定した再生回数未満の動画情報を取得する', async () => {
        const query = { view_count_lt: 2000 };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(5);
      });
      it('HTTP200 クエリパラメータで高評価数(以上)を指定すると指定した高評価数以上の動画情報を取得する', async () => {
        const query = { like_count_gt: 118103 }; // NHKのみ1件
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(1);
      });
      it('HTTP200 クエリパラメータで高評価数(未満)を指定すると指定した高評価数未満の動画情報を取得する', async () => {
        const query = { like_count_lt: 6 };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);
      });
      it('HTTP200 クエリパラメータで動画タイトルと動画概要説明を指定するとAND条件で部分一致する動画情報を取得する', async () => {
        const query = { title: 'ラジオ体操', description: '広島' };
        const res = await request.get('/videos').query(query);
        res.should.have.status(200);
        res.body.should.to.have.lengthOf(2);
      });
      it('HTTP404 クエリパラメータでIDを指定し動画情報を取得できなかった場合ステータスコード404が返却される', async () => {
        const query = { id: newVideo.notExists.id };
        const res = await request.get('/videos').query(query);
        res.should.have.status(404);
        res.body.should.to.deep.equal([]);
      });
      it('HTTP404 クエリパラメータでタイトルを指定し動画情報を取得できなかった場合ステータスコード404が返却される', async () => {
        const query = { title: newVideo.notExists.title };
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
        await knex.from(VIDEOS_TBL).where('id', '=', newVideo.correct.id).del();
      });

      it('HTTP201 動画情報を追加するとステータスコード201が返却される', async () => {
        const res = await request.post('/videos').send(newVideo.correct);
        res.should.have.status(201);
      });
      it('HTTP201 動画情報を追加すると動画リソースのURLが返却される', async () => {
        const res = await request.post('/videos').send(newVideo.correct);
        res.should.have.status(201);
        res.body.should.to.be.deep.equal([
          {
            url: `http://${ip.address()}:${process.env.PORT || 3000}/videos/${
              newVideo.correct.id
            }`,
          },
        ]);
      });
      it('HTTP400 動画情報を追加したがIDがない場合エラーメッセージが返却される', async () => {
        const res = await request
          .post('/videos')
          .send(newVideo.noRequiredProps);
        res.should.have.status(400);
        res.body.should.to.deep.equal({
          message: '必須項目がありません',
          required: 'id',
        });
      });
    });

    describe('PATCH /:id', () => {
      beforeEach(async () => {
        await knex.insert(newVideo.correct).into(VIDEOS_TBL);
      });

      afterEach(async () => {
        await knex.from(VIDEOS_TBL).where('id', newVideo.correct.id).del();
      });

      it('HTTP200 動画情報を変更すると変更された動画リソースのURLが返却される', async () => {
        const expectBody = newVideo.correct;
        expectBody.title = 'テストタイトル変更後';
        const res = await request
          .patch(`/videos/${newVideo.correct.id}`)
          .send({ title: 'テストタイトル変更後' });
        res.should.have.status(200);
        // res.body.should.to.deep.equal([expectBody]);
        res.body.should.to.be.deep.equal([
          {
            url: `http://${ip.address()}:${process.env.PORT || 3000}/videos/${
              expectBody.id
            }`,
          },
        ]);
      });

      it('HTTP400 動画情報を変更しようとしたが不正な項目が含まれている場合エラーメッセージが返却される', async () => {
        const res = await request.patch(`/videos/${newVideo.correct.id}`).send({
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
        await knex.insert(newVideo.correct).into(VIDEOS_TBL);
      });

      it('HTTP204 動画情報を削除するとステータスコード204が返却される', async () => {
        const res = await request.delete(`/videos/${newVideo.correct.id}`);
        res.should.have.status(204);
      });

      it('HTTP404 削除対象の動画情報がなかった場合ステータスコード404が返却される', async () => {
        const res = await request.delete(`/videos/${newVideo.notExists.id}`);
        res.should.have.status(404);
      });
    });
  });
});
