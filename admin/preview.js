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

  function HomepageImageCard(title, item, square) {
    var image = item && item.image;
    var alt = item && item.alt;
    var className = square ? 'cms-home-image-card cms-home-image-card--square' : 'cms-home-image-card';

    return h('article', { className: className },
      image ? h('span', { className: 'cms-home-image-frame', style: square ? imageStyle(item) : {} },
        h('img', { src: imagePath(image), alt: alt || title })
      ) : h('div', { className: 'cms-image-placeholder' }, 'No image selected'),
      h('div', {},
        h('h3', {}, title),
        h('p', {}, alt || 'Add helpful alt text for this image.')
      )
    );
  }

  function HomepageImagesPreview(data) {
    var sectors = data.sectors || {};

    return h('div', { className: 'cms-site-preview' },
      SiteHeader(),
      h('main', { id: 'main-content' },
        h('section', { className: 'hero hero-video cms-home-hero-preview' },
          data.heroPoster
            ? h('img', { className: 'hero-bg-video', src: imagePath(data.heroPoster), alt: 'Homepage hero poster preview' })
            : h('div', { className: 'cms-image-placeholder cms-home-hero-placeholder' }, 'Hero poster image'),
          h('div', { className: 'hero-overlay', 'aria-hidden': 'true' }),
          h('div', { className: 'container hero-content' },
            h('div', { className: 'hero-copy' },
              h('p', { className: 'hero-eyebrow' }, 'Commercial energy optimisation'),
              h('h1', {}, 'Find the energy waste everyone else misses.'),
              h('p', { className: 'lead' }, 'This preview shows where the selected homepage images will sit. Copy is shown for layout context only.')
            )
          )
        ),
        h('section', { className: 'page-section' },
          h('div', { className: 'container' },
            h('div', { className: 'cms-preview-note' },
              'Homepage image preview. Save/publish to see the exact live page after Netlify rebuilds.'
            ),
            h('div', { className: 'cms-home-image-grid' },
              HomepageImageCard('Problem section', data.problem),
              HomepageImageCard('Discovery service card', data.discovery),
              HomepageImageCard('Roadmap preview', data.roadmap),
              HomepageImageCard('Hotels sector tile', sectors.hotels, true),
              HomepageImageCard('Pubs and restaurants tile', sectors.restaurants, true),
              HomepageImageCard('Commercial property tile', sectors.commercial, true),
              HomepageImageCard('Leisure tile', sectors.leisure, true)
            )
          )
        )
      ),
      SiteFooter()
    );
  }

  function OtherPageImagesPreview(data) {
    var services = data.services || {};
    var about = data.about || {};
    var servicePages = data.servicePages || {};
    var policy = data.policy || {};

    return h('div', { className: 'cms-site-preview' },
      SiteHeader(),
      h('main', { id: 'main-content' },
        h('section', { className: 'page-hero' },
          h('div', { className: 'container' },
            h('p', { className: 'page-eyebrow' }, 'CMS image library'),
            h('h1', {}, 'Other page images'),
            h('p', { className: 'lead' }, 'These images feed Services, About, individual service pages and Terms/Policies.')
          )
        ),
        h('section', { className: 'page-section' },
          h('div', { className: 'container' },
            h('div', { className: 'cms-home-image-grid' },
              HomepageImageCard('Services: Discovery', services.discovery),
              HomepageImageCard('Services: Roadmap', services.roadmap),
              HomepageImageCard('Services: EOaaS', services.eoaas),
              HomepageImageCard('Services: Groundwork logo', services.groundwork),
              HomepageImageCard('About: Intro', about.intro),
              HomepageImageCard('About: Story', about.story),
              HomepageImageCard('About: Hospitality', about.hospitality),
              HomepageImageCard('About: Hotels', about.hotels),
              HomepageImageCard('About: Manufacturing', about.manufacturing),
              HomepageImageCard('About: Commercial', about.commercial),
              HomepageImageCard('About: Why choose us', about.whyChooseUs),
              HomepageImageCard('About: Jon', about.jon),
              HomepageImageCard('About: Jennifer', about.jennifer),
              HomepageImageCard('About: Groundwork logo', about.groundwork),
              HomepageImageCard('About: Auditor logo', about.auditor),
              HomepageImageCard('EOaaS page', servicePages.eoaas),
              HomepageImageCard('Roadmap page', servicePages.roadmap),
              HomepageImageCard('Onsite page', servicePages.onsite),
              HomepageImageCard('Terms: Colets', policy.colets),
              HomepageImageCard('Terms: Cote', policy.cote),
              HomepageImageCard('Terms: Groundwork', policy.groundwork)
            )
          )
        )
      ),
      SiteFooter()
    );
  }

  function SettingsPreview(props) {
    var data = getData(props.entry);

    if (data.heroPoster || data.problem || data.sectors) {
      return HomepageImagesPreview(data);
    }

    if (data.services || data.about || data.servicePages || data.policy) {
      return OtherPageImagesPreview(data);
    }

    if (data.partnerTrust || data.reviews) {
      return h('div', { className: 'cms-site-preview' },
        SiteHeader(),
        h('main', { className: 'page-section' },
          h('div', { className: 'container prose-wide prose' },
            h('h1', {}, 'Results page content'),
            h('p', {}, data.quote || 'Client quote will appear here.'),
            data.partnerTrust ? h('div', { className: 'cms-preview-note' }, data.partnerTrust.title || 'Partner trust section') : null
          )
        ),
        SiteFooter()
      );
    }

    return h('div', { className: 'cms-site-preview' },
      SiteHeader(),
      h('main', { className: 'page-section' },
        h('div', { className: 'container prose-wide prose' },
          h('h1', {}, 'Page setting'),
          h('p', {}, data.intro || 'Edit this setting using the form on the left.')
        )
      ),
      SiteFooter()
    );
  }

  function SharePreview() {
    return h('aside', { className: 'article-share', 'aria-label': 'Share this article' },
      h('h2', {}, 'Share this insight'),
      h('div', { className: 'article-share-links' },
        h('a', {}, 'LinkedIn'),
        h('a', {}, 'Facebook'),
        h('a', {}, 'X'),
        h('a', {}, 'Email'),
        h('button', { type: 'button' }, 'Copy link')
      ),
      h('p', { className: 'article-share-status', 'aria-live': 'polite' })
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
            SharePreview(),
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
  window.CMS.registerPreviewTemplate('homepage_images', SettingsPreview);
  window.CMS.registerPreviewTemplate('other_page_images', SettingsPreview);
  window.CMS.registerPreviewTemplate('page_text', SettingsPreview);
})();
