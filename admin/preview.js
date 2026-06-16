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

  function imageStyle(data) {
    return {
      '--image-fit': data.imageFit || 'cover',
      '--image-position': data.imagePosition || 'center center',
      '--image-zoom': data.imageZoom || 1,
    };
  }

  function SiteHeader() {
    var links = ['Home', 'Services', 'Solutions', 'Results', 'About', 'Insights', 'Contact'];

    return h('header', { className: 'site-header cms-preview-header' },
      h('div', { className: 'container header-inner' },
        h('a', { className: 'site-logo' },
          h('img', {
            src: '/assets/images/green-wing-logo-full-colour.svg',
            alt: 'Green Wing Energy Solutions',
            width: 175,
            height: 58,
          })
        ),
        h('nav', { className: 'main-nav', 'aria-label': 'Main navigation preview' },
          h('ul', {}, links.map(function (label) {
            return h('li', {}, h('a', {
              className: label === 'Insights' ? 'active' : '',
              'aria-current': label === 'Insights' ? 'page' : undefined,
            }, label));
          }))
        ),
        h('div', { className: 'header-actions' },
          h('a', { className: 'btn btn-solid header-cta' }, 'Arrange an Energy Review')
        )
      )
    );
  }

  function SiteFooter() {
    return h('footer', { className: 'site-footer cms-preview-footer' },
      h('div', { className: 'container footer-slim' },
        h('div', { className: 'footer-slim-main' },
          h('a', { className: 'footer-logo' },
            h('img', {
              src: '/assets/images/green-wing-logo-white.svg',
              alt: 'Green Wing Energy Solutions',
              width: 120,
              height: 38,
            })
          ),
          h('nav', { className: 'footer-links-inline', 'aria-label': 'Footer preview' },
            ['Discovery', 'Roadmap', 'EOaaS', 'About', 'Results', 'Insights', 'Contact'].map(function (label) {
              return h('a', {}, label);
            })
          )
        ),
        h('div', { className: 'footer-slim-bottom' },
          h('p', {}, '© Green Wing Energy Solutions')
        )
      )
    );
  }

  function InsightPreview(props) {
    var data = getData(props.entry);
    var image = imagePath(data.image);

    return h('div', { className: 'cms-site-preview' },
      SiteHeader(),
      h('main', { id: 'main-content' },
        h('section', { className: 'page-hero' },
          h('div', { className: 'container prose-wide' },
            h('p', { className: 'back-link' }, h('a', {}, '← Insights')),
            h('time', {}, readableDate(data.date)),
            h('h1', {}, data.title || 'Article title')
          )
        ),
        h('section', { className: 'page-section' },
          h('div', { className: 'container prose-wide prose' },
            image ? h('figure', { className: 'article-hero-image', style: imageStyle(data) },
              h('img', {
                src: image,
                alt: data.imageAlt || data.title || '',
              })
            ) : null,
            image ? h('div', { className: 'cms-preview-note cms-preview-image-note' },
              'Image settings: ',
              h('strong', {}, data.imageFit || 'cover'),
              ' · ',
              data.imagePosition || 'center center',
              ' · zoom ',
              data.imageZoom || 1
            ) : null,
            data.showScopeInfographic ? h('div', { className: 'cms-preview-note' },
              'Scope 1 / 2 / 3 infographic will appear here on the live article.'
            ) : null,
            props.widgetFor('body'),
            h('p', {}, h('a', { className: 'btn btn-solid btn-arrow' }, 'Arrange an Energy Review'))
          )
        )
      ),
      SiteFooter()
    );
  }

  window.CMS.registerPreviewStyle('/css/styles.css');
  window.CMS.registerPreviewStyle('/admin/preview.css');
  window.CMS.registerPreviewTemplate('insights', InsightPreview);
})();
