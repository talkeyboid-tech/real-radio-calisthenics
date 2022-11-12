window.addEventListener('load', () => {
  // 実装例
  // const videoAreaEl = document.querySelector('#video-area');
  // const videoAreaElChild = document.createElement('div');
  // videoAreaElChild.textContent = 'hoge';
  // videoAreaEl.appendChild(videoAreaElChild);
  // 検索ボタン
  // const searchButton = document.getElementById('search-btn');
  // searchButton.addEventListener('click', () => {
  //   console.log('hoge');
  // });

  const getAll = async () => {
    const res = await fetch('http://localhost:3000/videos');
    return await res.json();
  };

  getAll().then((res) => {
    res.forEach((video) => {
      const videoAreaEl = document.querySelector('#video-area');
      const videoAreaElChild = document.createElement('div');
      videoAreaElChild.textContent = video.title;
      videoAreaEl.appendChild(videoAreaElChild);
    });
  });

  // Promise.all(getAll).then((res) => {
  //   console.log(res);
  // });

  // fetch('http://localhost:3000/videos').then((res) => {
  //   console.log(typeof res.json());
  //   const a = res.json();
  //   a.forEach((b) => {
  //     console.log(b);
  //   });
  // });
});
