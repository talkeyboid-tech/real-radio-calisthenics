const _ = require('lodash');

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
  convertCamelToSnake,
};
