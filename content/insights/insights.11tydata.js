const path = require('path');

module.exports = {
  layout: 'layouts/insight.njk',
  tags: ['insight'],
  eleventyComputed: {
    permalink: (data) => {
      const slug = path.basename(data.page.inputPath, path.extname(data.page.inputPath));
      return `insights/${slug}.html`;
    },
    root: () => '../',
  },
};
