/**
 * Converts a subset of Markdown to safe HTML for rendering inside dangerouslySetInnerHTML.
 * Supported: bold, italic, inline code, h1-h3, hr, blockquotes, ul/ol lists, tables, paragraphs.
 */
export function renderMarkdown(text) {
  if (!text) return "";

  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const renderInline = (value) =>
    value
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code class="md-inline-code">$1</code>');

  const renderTable = (block) => {
    const rows = block
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));

    if (rows.length < 2) return block;

    const headerCells = rows[0].map((cell) => `<th>${renderInline(cell)}</th>`).join("");
    const bodyRows = rows.slice(2).map(
      (row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`
    );

    return `\n\n<table class="md-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows.join("")}</tbody></table>\n\n`;
  };

  let html = escapeHtml(text);

  html = html.replace(
    /^\s*\|?.+\|.*\r?\n\s*\|?[-:\s|]+\r?\n(?:\s*\|?.*\|.*\r?\n?)+/gm,
    (match) => renderTable(match)
  );

  html = html
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, '<code class="md-inline-code">$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="md-hr" />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // List items
    .replace(/^\* (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
    // Wrap consecutive <li> runs in <ul> / <ol>
    .replace(/(<li class="md-li">[\s\S]+?<\/li>)+/g, (m) => `<ul class="md-ul">${m}</ul>`)
    .replace(/(<li class="md-oli">[\s\S]+?<\/li>)+/g, (m) => `<ol class="md-ol">${m}</ol>`)
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, "<br />");

  return `<p class="md-p">${html}</p>`;
}
