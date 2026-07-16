const path = require('path');
const solutionsCategories = require('./_data/solutions-categories.json');

function insightHref(item) {
  const inputPath = item && (item.inputPath || (item.page && item.page.inputPath));
  if (inputPath) {
    const clean = inputPath.replace(/\\/g, '/').replace(/^\.\//, '');
    if (clean.startsWith('content/insights/')) {
      return `/${clean.replace(/^content\//, '').replace(/\.(md|html)$/, '.html')}`;
    }
    if (clean.startsWith('insights/')) {
      return `/${clean.replace(/\.(md|html)$/, '.html')}`;
    }
  }

  return (item && item.page && item.page.url) || (item && item.url) || '#';
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('admin');
  eleventyConfig.addPassthroughCopy('robots.txt');

  eleventyConfig.addGlobalData('eleventyComputed', {
    permalink: (data) => {
      const inputPath = data.page && data.page.inputPath;
      if (!inputPath || !inputPath.endsWith('.html')) return data.permalink;

      const stem = data.page.filePathStem && data.page.filePathStem.replace(/^\/+/, '');
      if (stem) return `${stem}.html`;

      return path.basename(inputPath);
    },
  });

  eleventyConfig.addFilter('readableDate', (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  eleventyConfig.addFilter('isoDate', (value) => {
    const d = value instanceof Date ? value : new Date(value);
    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter('urlEncode', (value) => encodeURIComponent(String(value || '')));
  eleventyConfig.addFilter('insightHref', insightHref);

  eleventyConfig.addCollection('insightsSorted', (api) =>
    api.getFilteredByTag('insight').sort((a, b) => {
      const bDate = new Date(b.data.date || b.date).getTime();
      const aDate = new Date(a.data.date || a.date).getTime();
      return bDate - aDate;
    })
  );

  eleventyConfig.addCollection('solutionsByCategory', (api) => {
    const order = solutionsCategories;
    const items = api.getFilteredByTag('solution').sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
    const map = new Map();
    items.forEach((item) => {
      const cat = item.data.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(item);
    });
    const groups = [...map.entries()].map(([category, solutions]) => ({ category, solutions }));
    groups.sort((a, b) => {
      const ai = order.indexOf(a.category);
      const bi = order.indexOf(b.category);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    return groups;
  });

  eleventyConfig.addCollection('caseStudiesSorted', (api) =>
    api.getFilteredByTag('caseStudy').sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  eleventyConfig.addFilter('relatedInsights', (posts, currentUrl, limit = 3) =>
    posts.filter((p) => insightHref(p) !== currentUrl).slice(0, limit)
  );

  eleventyConfig.addFilter('featuredInsight', (posts) => {
    if (!posts.length) return null;
    return posts.find((p) => p.data.featured) || posts[0];
  });

  eleventyConfig.addFilter('otherInsights', (posts, featuredUrl) =>
    posts.filter((p) => insightHref(p) !== featuredUrl)
  );

  eleventyConfig.addFilter('assetPath', (path, root = '') => {
    if (!path) return '';
    const clean = String(path).replace(/^\//, '');
    return `${root}${clean}`;
  });

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    templateFormats: ['html', 'md', 'njk'],
  };
};
