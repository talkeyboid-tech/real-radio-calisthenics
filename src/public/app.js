window.addEventListener('load', () => {
  const getAll = async () => {
    const res = await fetch(
      'http://localhost:3000/videos?limit=10&random=true'
    );
    return await res.json();
  };

  getAll().then((res) => {
    const videoAreaEl = document.querySelector('#video-area');
    const videoWrapperEl = document.createElement('div');

    videoWrapperEl.id = 'video-wrapper';

    res.forEach((video) => {
      const videoContainerEl = document.createElement('span');
      videoContainerEl.id = 'video-container';
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
      videoContainerEl.appendChild(iframeEl);
      videoWrapperEl.appendChild(videoContainerEl);
    });
    videoAreaEl.appendChild(videoWrapperEl);
  });

  const refreshButton = document.getElementById('refresh-btn');
  refreshButton.addEventListener('click', () => {
    getAll().then((res) => {
      const videoAreaEl = document.querySelector('#video-area');
      videoAreaEl.querySelector('#video-wrapper').remove();
      const videoWrapperEl = document.createElement('div');

      videoWrapperEl.id = 'video-wrapper';

      res.forEach((video) => {
        const videoContainerEl = document.createElement('span');
        videoContainerEl.id = 'video-container';
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
        videoContainerEl.appendChild(iframeEl);
        videoWrapperEl.appendChild(videoContainerEl);
      });
      videoAreaEl.appendChild(videoWrapperEl);
    });
  });
});
