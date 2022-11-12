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
    const res = await fetch(
      'http://localhost:3000/videos?limit=10&random=true'
    );
    return await res.json();
  };

  getAll().then((res) => {
    const videoAreaEl = document.querySelector('#video-area');
    const videoAreaElChild = document.createElement('div');
    videoAreaElChild.id = 'video-wrapper';
    res.forEach((video) => {
      const iframeEl = document.createElement('iframe');
      iframeEl.width = '560';
      iframeEl.height = '315';
      iframeEl.position = 'absolute';
      iframeEl.src = `https://www.youtube.com/embed/${video.id}`;
      iframeEl.title = video.title;
      iframeEl.setAttribute('frameBorder', 0);
      iframeEl.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframeEl.setAttribute('allowfullscreen', '');
      videoAreaElChild.appendChild(iframeEl);
      videoAreaEl.appendChild(videoAreaElChild);
    });
  });

  const refreshButton = document.getElementById('refresh-btn');
  refreshButton.addEventListener('click', () => {
    getAll().then((res) => {
      const videoAreaEl = document.querySelector('#video-area');
      videoAreaEl.querySelector('#video-wrapper').remove();
      const videoAreaElChild = document.createElement('div');
      videoAreaElChild.id = 'video-wrapper';
      res.forEach((video) => {
        const iframeEl = document.createElement('iframe');
        iframeEl.width = '560';
        iframeEl.height = '315';
        iframeEl.position = 'absolute';
        iframeEl.src = `https://www.youtube.com/embed/${video.id}`;
        iframeEl.title = video.title;
        iframeEl.setAttribute('frameBorder', 0);
        iframeEl.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframeEl.setAttribute('allowfullscreen', '');
        videoAreaElChild.appendChild(iframeEl);
        videoAreaEl.appendChild(videoAreaElChild);
      });
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
