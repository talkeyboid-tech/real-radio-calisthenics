const _ = require('lodash');

/**
 * 整数文字列判定
 *
 * @param {string} str
 * @returns {boolean}
 */
// const isIntString = (str) => {
//   const isIntString = str.match(/^[0-9]+$/g) == null ? false : true;
//   return isIntString;
// };

/**
 * 配列変換
 * 引数が1件であれば [{}] の配列で返却する
 * 引数が falsy であれば [] を返却する。
 *
 * @param {any} any
 * @returns {Array} 配列
 */
const convertToArray = (arg) => {
  if (arg === undefined || arg === null || Object.keys(arg).length === 0)
    return [];
  return Array.isArray(arg) ? arg : [arg];
};

/**
 * オブジェクトキー変換（camel to snake)
 *
 * @param {object} キーがキャメルケースのオブジェクト または オブジェクト配列
 * @returns キーがスネークケースになったオブジェクト または オブジェクト配列
 */
const convertCamelToSnake = (arg) => {
  const arr = Array.isArray(arg) ? arg : [arg];
  const retArr = arr.map((elem) => {
    const retObj = {};
    Object.keys(elem).forEach((key) => {
      retObj[_.snakeCase(key)] = elem[key];
    });
    return retObj;
  });
  return retArr.length > 0 ? retArr : retArr[0];
};

module.exports = {
  // isIntString,
  convertToArray,
  convertCamelToSnake,
};
