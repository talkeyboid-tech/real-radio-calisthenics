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

module.exports = {
  convertToArray,
};
