const _ = require('lodash');
const utils = require('../util/utils');
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

/**
 * リソースURL文字列生成
 *
 * @param {object} req - express req
 * @param {string} resourceId - リソースID(PATCHなどreq.originalUrlにIDを含む場合は省略)
 * @returns リソースURL文字列
 */
const generateResourceUrl = (req, resourceId = undefined) => {
  const { protocol, originalUrl } = req;
  const host = utils.getHost();
  const port = utils.getPort();
  return resourceId
    ? `${protocol}://${host}:${port}${originalUrl}/${resourceId}`
    : `${protocol}://${host}:${port}${originalUrl}`;
};

module.exports = {
  convertCamelToSnake,
  generateResourceUrl,
};
