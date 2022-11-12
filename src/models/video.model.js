const knex = require('../knex');
const VIDEOS_TBL = 'videos';

// バリデーション設定
const { validProps, requiredProps } = require('../util/validation');
const validateProps = validProps([
  'id',
  'title',
  'description',
  'view_count',
  'like_count',
]);
const validateRequired = requiredProps(['id', 'title']);

// TODO: selectのオブジェクトは共通化する
const videoModel = {
  getAll(limit = 1000) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(VIDEOS_TBL)
      .limit(limit)
      .orderBy('id', 'asc');
  },

  getById(id) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(VIDEOS_TBL)
      .where('id', '=', id)
      .first();
  },

  getByQuery(query) {
    // limitとoffset以外のクエリを取得
    const queryWithoutLimitOffsetRandom = {};
    Object.assign(queryWithoutLimitOffsetRandom, query);
    delete queryWithoutLimitOffsetRandom.limit;
    delete queryWithoutLimitOffsetRandom.offset;
    delete queryWithoutLimitOffsetRandom.random;

    // 分岐判定フラグ
    const existsLimit = !!query.limit;
    const existsOffset = !!query.offset;
    const existsRandom = !!query.random;
    const existsWithoutLimitAndOffset = !!Object.keys(
      queryWithoutLimitOffsetRandom
    ).length;

    // SQL文生成
    let sql = `select * from ${VIDEOS_TBL}`;
    // WHERE句作成
    if (existsWithoutLimitAndOffset) {
      sql = sql.concat(` where`);
      for (const key in queryWithoutLimitOffsetRandom) {
        if (Object.hasOwnProperty.call(queryWithoutLimitOffsetRandom, key)) {
          // LIKE検索
          if (['title', 'description'].includes(key)) {
            sql = sql.concat(
              ` ${key} like '%${queryWithoutLimitOffsetRandom[key]}%'`
            );
          } else if (key.slice(-3) === '_gt') {
            sql = sql.concat(
              ` ${key.replace('_gt', '')} >= ${
                queryWithoutLimitOffsetRandom[key]
              }`
            );
          } else if (key.slice(-3) === '_lt') {
            sql = sql.concat(
              ` ${key.replace('_lt', '')} < ${
                queryWithoutLimitOffsetRandom[key]
              }`
            );
          } else {
            sql = sql.concat(
              ` ${key} = '${queryWithoutLimitOffsetRandom[key]}'`
            );
          }
          sql = sql.concat(` and`);
        }
      }
      sql = sql.slice(0, -4); // NOTE: 最後の' and'を削除(他にいい方法あると思う)
    }

    // ORDER BY 句生成
    if (existsRandom && query.random === 'true') {
      sql = sql.concat(' order by random()');
    } else {
      sql = sql.concat(' order by id asc');
    }
    if (existsLimit) sql = sql.concat(` limit ${query.limit}`);
    if (existsOffset) sql = sql.concat(` offset ${query.offset}`);

    // SQL実行
    return knex.raw(sql).then((res) => {
      if (res.rows.length === 0) return undefined;
      return res.rows;
    });
  },

  create(obj) {
    validateRequired(validateProps(obj));
    return new Promise((resolve) => {
      knex(VIDEOS_TBL)
        .insert(obj)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        });
    });
  },

  remove(id) {
    return new Promise((resolve) => {
      knex(VIDEOS_TBL)
        .where('id', '=', id)
        .del()
        .then((res) => {
          resolve(res);
        });
    });
  },

  update(id, obj) {
    validateProps(obj);
    return new Promise((resolve, reject) => {
      knex(VIDEOS_TBL)
        .where('id', '=', id)
        .update(obj)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = { videoModel, VIDEOS_TBL };
