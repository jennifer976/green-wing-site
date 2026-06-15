(function () {
  if (!window.netlifyIdentity) return;

  window.netlifyIdentity.on('init', function (user) {
    if (!user) {
      window.netlifyIdentity.on('login', function () {
        window.location.href = '/admin/';
      });
    }
  });
})();
