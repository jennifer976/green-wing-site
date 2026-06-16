(function () {
  if (!window.CMS || !window.h) return;

  var h = window.h;

  function getData(entry) {
    var data = entry.get('data');
    return data && data.toJS ? data.toJS() : {};
  }

  function imagePath(path) {
    if (!path) return '';
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function readableDate(value) {
    if (!value) return 'Draft date';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function InsightPreview(props) {
    var data = getData(props.entry);
    var image = imagePath(data.image);

    return h('main', { className: 'cms-site-preview' },
      h('section', { className: 'page-hero' },
        h('div', { className: 'container prose-wide' },
          h('p', { className: 'back-link' }, h('a', {}, '← Insights')),
          h('time', {}, readableDate(data.date)),
          h('h1', {}, data.title || 'Article title')
        )
      ),
      h('section', { className: 'page-section' },
        h('div', { className: 'container prose-wide prose' },
          image ? h('figure', { className: 'article-hero-image' },
            h('img', {
              src: image,
              alt: data.imageAlt || data.title || '',
            })
          ) : null,
          data.showScopeInfographic ? h('div', { className: 'cms-preview-note' },
            'Scope 1 / 2 / 3 infographic will appear here on the live article.'
          ) : null,
          props.widgetFor('body'),
          h('p', {}, h('a', { className: 'btn btn-solid btn-arrow' }, 'Arrange an Energy Review'))
        )
      )
    );
  }

  window.CMS.registerPreviewStyle('/css/styles.css');
  window.CMS.registerPreviewStyle('/admin/preview.css');
  window.CMS.registerPreviewTemplate('insights', InsightPreview);
})();
