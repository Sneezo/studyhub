import { useState } from "react";
import type { Term } from "../data/terms";

type ExportFormat = "csv" | "json" | "txt" | "pdf";
type ExportTerm = Pick<Term, "term" | "definition">;

function csvCell(value: string) {
  // Quoting alone does not prevent spreadsheet applications executing formulas.
  const safe = /^[\s\u0000-\u001f]*[=+@-]|^[\t\r\n]/u.test(value)
    ? `'${value}`
    : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function printStudySheet(terms: ExportTerm[], subjectName: string, filename: string) {
  const sheet = window.open("", "_blank");
  if (!sheet) {
    return "Please allow pop-ups to open the printable study sheet.";
  }
  sheet.opener = null;
  const doc = sheet.document;
  doc.title = filename;
  doc.documentElement.lang = "en";
  const charset = doc.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  const viewport = doc.createElement("meta");
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1";
  const style = doc.createElement("style");
  style.textContent = `
    body { font: 16px/1.6 system-ui, sans-serif; color: #111417;
      max-width: 850px; margin: 2rem auto; padding: 0 1.5rem; }
    h1 { border-bottom: 3px solid #e65a2a; padding-bottom: .5rem; }
    h2 { font-size: 1.15rem; margin-bottom: .25rem; }
    section { break-inside: avoid; border-bottom: 1px solid #e4e4e4; padding: .5rem 0; }
    h1, h2, p { white-space: pre-wrap; overflow-wrap: anywhere; }
    p { margin-top: 0; }
    button { background: #e65a2a; color: white; border: 0; border-radius: 8px;
      padding: .65rem .9rem; font: inherit; cursor: pointer; }
    @page { margin: 18mm; }
    @media print { body { max-width: none; margin: 0; padding: 0; } button { display: none; } }
  `;
  doc.head.append(charset, viewport, style);
  const printButton = doc.createElement("button");
  printButton.type = "button";
  printButton.textContent = "Print / Save as PDF";
  printButton.addEventListener("click", () => sheet.print());
  const heading = doc.createElement("h1");
  heading.textContent = `${subjectName} — Study sheet`;
  doc.body.append(printButton, heading);
  for (const term of terms) {
    const section = doc.createElement("section");
    const title = doc.createElement("h2");
    title.textContent = term.term;
    const definition = doc.createElement("p");
    definition.textContent = term.definition;
    section.append(title, definition);
    doc.body.append(section);
  }
  return "";
}

export function TermExport({ terms, subjectName }: {
  terms: readonly ExportTerm[];
  subjectName: string;
}) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [error, setError] = useState("");

  function handleExport() {
    if (terms.length === 0) return;
    setError("");
    const filename = `StudyHub-${subjectName.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim() || "Subject"}`;
    // Explicitly project the data so descriptions, tags and review data stay out.
    const data = terms.map(({ term, definition }) => ({ term, definition }));
    if (format === "pdf") {
      setError(printStudySheet(data, subjectName, filename));
      return;
    }
    const content = format === "csv"
      ? "\uFEFFTerm,Definition\r\n" + data.map(({ term, definition }) =>
          `${csvCell(term)},${csvCell(definition)}`).join("\r\n")
      : format === "json"
        ? JSON.stringify(data, null, 2)
        : data.map(({ term, definition }) => `${term}\n${definition}`).join("\n\n");
    const mime = format === "csv" ? "text/csv" : format === "json" ? "application/json" : "text/plain";
    const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="term-export" role="group" aria-label="Export terms"
      onKeyDown={(event) => event.stopPropagation()}>
      <select aria-label="Export format" value={format} disabled={terms.length === 0}
        onChange={(event) => setFormat(event.target.value as ExportFormat)}>
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
        <option value="txt">TXT</option>
        <option value="pdf">PDF</option>
      </select>
      <button type="button" disabled={terms.length === 0} onClick={handleExport}>Export</button>
      {error && <span className="term-export-error" role="alert">{error}</span>}
    </div>
  );
}
