const fs = require('fs');
require('dotenv').config({
  path: './.env.local',
});

// ラジオ体操URL
const videoIds = [
  'feSVtC1BSeQ',
  'dzQIMo-Xvyg',
  '_YZZfaMGEOU',
  'PBRGLbrlUEk',
  '6kxutoiglU0',
  '4nMBykQfpMg',
  'UEPyPyRt-8c',
  'SLEq8rPafy4',
  '9Z02t3GWyXw',
  'eDx5hcz5b9Q',
  'EvEFFrS7kl4',
  'Zxw3_HEBkpY',
  'E4Pr-b1vCBk',
  'yQ7Oo9IUN7s',
  'wpa_gGmEUPU',
  'KD_ArxxkeO0',
  'Hxm5P4l7f78',
  'eudwLhiTRrY',
  'gVEuBFcp-_k',
  '5iv6TkqkwKY',
  'HOZob780dfY',
  'cC9T3rZ4PoE',
  '6JL7kX_zmrM',
  'Ez9GxRxRXSY',
  'tzpkrPJU9bk',
  'IWC5X0GVBCk',
  'q5xJIu40R38',
  'Qz8Gef3m8M4',
  '-Nx3sAq1ERA',
  '3BZ9_Bf4TU8',
  'GCRnsSkVfTg',
  '1Qc14LQxSdI',
  '2_Do7426KnQ',
  'ulR62aL3h7A',
  'bDYe8kTqpVw',
  'YvLT3vfNCIg',
  'TJH2MGNtwiM',
  'NH9_rg4Tpj8',
  'IantCvdO1Ow',
  'QpJxogm8qo0',
  'ZVxRYVP0riQ',
  '1vRPfMtSAW8',
];

const BASE_URL =
  'https://www.googleapis.com/youtube/v3/videos?id=[VIDEO_ID]&key=[API_KEY]&part=snippet,contentDetails,statistics,status';

const urls = videoIds.map((id) => {
  const urlWithId = BASE_URL.replace('[VIDEO_ID]', id);
  const urlWithKey = urlWithId.replace('[API_KEY]', process.env.GOOGLE_API_KEY);
  return urlWithKey;
});

// ラジオ体操動画情報取得
const fetchInfo = async (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        resolve(res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// ラジオ体操動画情報保存
const promiseArr = urls.map((url) => fetchInfo(url));

Promise.all(promiseArr).then((res) => {
  fs.writeFile('./.dev/videos.json', JSON.stringify(res, null, 2), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});
