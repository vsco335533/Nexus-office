/**
 * Convert HTML content to a .doc Blob that Microsoft Word can open.
 * This replaces the incompatible html-docx-js package which uses
 * `with` statements that break in ESM/strict mode (Cloudflare Workers).
 *
 * The approach: Word can open HTML files saved as .doc. We wrap the
 * HTML content in a proper Word-compatible HTML document with XML
 * namespaces that Word recognizes.
 */
export function htmlToDocBlob(htmlContent) {
  const header = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.6; }
        h1 { font-size: 24pt; }
        h2 { font-size: 18pt; }
        h3 { font-size: 14pt; }
        table { border-collapse: collapse; }
        td, th { border: 1px solid #999; padding: 4px 8px; }
      </style>
    </head>
    <body>
  `;
  const footer = `</body></html>`;

  // Strip any existing doctype/html/body wrappers from the content
  let cleaned = htmlContent
    .replace(/<!doctype[^>]*>/i, '')
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<\/?head[^>]*>.*?<\/head>/gis, '')
    .replace(/<\/?body[^>]*>/gi, '');

  const fullDoc = header + cleaned + footer;
  return new Blob([fullDoc], {
    type: 'application/msword',
  });
}
