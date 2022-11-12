const ip = require('ip');

/**
 * 整数文字列判定
 * ex) "12" -> true, "012" -> true, "01a" -> false
 *
 * @param {string} 文字列
 * @returns {boolean} 文字列が数値であるか
 */
const isIntString = (str) => {
  return str.match(/^[0-9]+$/g) != null;
};

/**
 * 配列変換
 * 引数が1件であれば [{}] の配列で返却する
 * 引数が falsy であれば [] を返却する
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
 * ホストIP取得
 *
 * @returns {string} HOST IP
 */
const getHost = () => {
  return ip.address();
};

/**
 * ホストポート取得
 *
 * @returns {number} HOST PORT
 */
const getPort = () => {
  return process.env.PORT || 3000;
};

module.exports = {
  isIntString,
  convertToArray,
  getHost,
  getPort,
};
