module.exports = {
  /**
   * Generate a function to validate model properties
   * @param {Array<string>} valid - Array of valid properties as strings
   * @return {Function} A function that takes an object to validate
   */
  validProps(valid) {
    return (propsToCheck) => {
      for (const p in propsToCheck) {
        if (!valid.includes(p)) {
          throw new TypeError(
            JSON.stringify({
              message: '不正な項目が含まれています',
              invalid: p,
            })
          );
        }
      }
      return propsToCheck;
    };
  },

  /**
   * Generate a function to ensure required model properties
   * @param {Array<string>} valid - Array of required properties as strings
   * @return {Function} A function that takes an object to validate
   */
  requiredProps(required) {
    return (propsToCheck) => {
      for (const p of required) {
        if (!propsToCheck[p]) {
          throw new TypeError(
            JSON.stringify({
              message: '必須項目がありません',
              required: p,
            })
          );
        }
      }
      return propsToCheck;
    };
  },
};

// /**
//  * 項目チェックジェネレータ（対象外項目でエラー）
//  *
//  * @param {Array<string>} valid - バリデーション項目リスト
//  * @return {Function} バリデーション対象を受け取り判定する関数(return bool)
//  */
// const validProps = (valid) => {
//   return (propsToCheck) => {
//     let isValid = true;
//     for (const p in propsToCheck) {
//       if (!valid.includes(p)) {
//         throw new Error(`Invalid field: ${p}`);
//       }
//     }
//     return propsToCheck;
//   };
// };

// /**
//  * 必須項目チェックジェネレータ
//  *
//  * @param {Array<string>} valid - 必須項目のリスト
//  * @return {Function} バリデーション対象を受け取り判定する関数(return bool)
//  */
// const requiredProps = (required) => {
//   return (propsToCheck) => {
//     let isValid = true;
//     for (const p of required) {
//       if (!propsToCheck[p]) {
//         isValid = false;
//       }
//     }
//     return isValid;
//   };
// };

// module.exports = { validProps, requiredProps };
