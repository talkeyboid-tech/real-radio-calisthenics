const fs = require('fs');
const videosOrigin = require('./videos.json');

const videos = videosOrigin.map((video) => {
  const retObj = {};
  retObj.id = video.items[0].id;
  retObj.title = video.items[0].snippet.title;
  retObj.description = video.items[0].snippet.description;
  retObj.view_count = video.items[0].statistics.viewCount;
  retObj.like_count = video.items[0].statistics.likeCount;
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
