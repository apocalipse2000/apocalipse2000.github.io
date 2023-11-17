  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ouija/sw.js')
      .then(function () {
        console.log('service worker registered');
      })
      .catch(function () {
        console.warn('service worker failed');
      });
  }