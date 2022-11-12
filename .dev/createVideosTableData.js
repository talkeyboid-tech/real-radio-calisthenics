const fs = require('fs');
const videosOrigin = require('./videos.json');

// DB投入用JSON
const videos = videosOrigin.map((video) => {
  const retObj = {};
  retObj.id = video.items[0].id;
  retObj.title = video.items[0].snippet.title;
  retObj.description = video.items[0].snippet.description;
  retObj.view_count = parseInt(video.items[0].statistics.viewCount);
  retObj.like_count = parseInt(video.items[0].statistics.likeCount);
  return retObj;
});

fs.writeFile(
  './.dev/videosTable.json',
  JSON.stringify(videos, null, 2),
  (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }
);

// テスト用JSON作成
// テストで比較できるようソート
videos.sort((a, b) => (a.id < b.id ? -1 : 1));

fs.writeFile(
  './test/videosTableForTest.json',
  JSON.stringify(videos, null, 2),
  (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }
);
