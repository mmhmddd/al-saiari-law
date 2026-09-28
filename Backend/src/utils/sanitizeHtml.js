const DOMPurify = require('isomorphic-dompurify');

/**
 * Sanitizes rich-text HTML coming from the Angular admin editor before
 * it is stored in MongoDB. Strips scripts, event handlers, and any
 * unsafe attributes/tags while preserving standard formatting elements.
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote',
  'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'title', 'width', 'height',
  'class', 'style',
  'colspan', 'rowspan',
];

function sanitizeArticleHtml(dirtyHtml) {
  if (typeof dirtyHtml !== 'string' || dirtyHtml.trim() === '') {
    return '';
  }

  const clean = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Forbid inline event handlers and javascript: URIs implicitly
    // (DOMPurify strips these by default); explicitly forbid <script>/<style>/<iframe>
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });

  return clean;
}

module.exports = { sanitizeArticleHtml };
