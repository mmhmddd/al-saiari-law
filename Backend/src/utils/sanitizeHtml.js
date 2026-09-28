const xss = require('xss');

// Use a server-side, CommonJS-compatible sanitizer. The explicit whitelist
// retains the formatting supported by the admin editor while filtering
// executable tags, event handlers, and unsafe URL schemes.
const articleSanitizer = new xss.FilterXSS({
  whiteList: {
    h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
    p: [], br: [], hr: [],
    b: [], strong: [], i: [], em: [], u: [], s: [], strike: [],
    ul: [], ol: [], li: [],
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'class'],
    blockquote: [], span: ['class', 'style'], div: ['class', 'style'],
    table: ['class'], thead: [], tbody: [], tr: [],
    th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'],
    figure: ['class'], figcaption: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
});

function sanitizeArticleHtml(dirtyHtml) {
  if (typeof dirtyHtml !== 'string' || dirtyHtml.trim() === '') return '';
  return articleSanitizer.process(dirtyHtml);
}

module.exports = { sanitizeArticleHtml };
