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
    const queryWithoutLimitAndOffset = {};
    Object.assign(queryWithoutLimitAndOffset, query);
    delete queryWithoutLimitAndOffset.limit;
    delete queryWithoutLimitAndOffset.offset;

    // 分岐判定フラグ
    const existsLimit = !!query.limit;
    const existsOffset = !!query.offset;
    const existsWithoutLimitAndOffset = !!Object.keys(
      queryWithoutLimitAndOffset
    ).length;

    // SQL文生成
    let sql = `select * from ${VIDEOS_TBL}`;
    // WHERE句作成
    if (existsWithoutLimitAndOffset) {
      sql = sql.concat(` where`);
      for (const key in queryWithoutLimitAndOffset) {
        if (Object.hasOwnProperty.call(queryWithoutLimitAndOffset, key)) {
          // LIKE検索
          if (['title', 'description'].includes(key)) {
            sql = sql.concat(
              ` ${key} like '%${queryWithoutLimitAndOffset[key]}%'`
            );
            // } else if (['view_count_gt', 'like_count_gt'].includes(key) > 0) {
          } else if (key.slice(-3) === '_gt') {
            sql = sql.concat(
              ` ${key.replace('_gt', '')} >= ${queryWithoutLimitAndOffset[key]}`
            );
          } else if (key.slice(-3) === '_lt') {
            sql = sql.concat(
              ` ${key.replace('_lt', '')} < ${queryWithoutLimitAndOffset[key]}`
            );
          } else {
            sql = sql.concat(` ${key} = '${queryWithoutLimitAndOffset[key]}'`);
          }
        }
      }
    }
    sql = sql.concat(' order by id asc');
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
