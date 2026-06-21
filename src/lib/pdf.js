import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text from a PDF file on the client.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    pages.push(text);
  }

  return pages.join('\n\n');
}

/**
 * Mask obvious personal identifiers before sending to backend.
 * @param {string} text
 * @returns {string}
 */
export function maskPersonalInfo(text) {
  let masked = text;

  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');

  masked = masked.replace(
    /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    '[PHONE REDACTED]'
  );

  masked = masked.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]');

  masked = masked.replace(
    /\b\d{1,5}\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)\.?\b/gi,
    '[ADDRESS REDACTED]'
  );

  masked = masked.replace(/(?:signed|signature|tenant|landlord)\s*:?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/gi, (m) => {
    const label = m.split(':')[0];
    return `${label}: [NAME REDACTED]`;
  });

  return masked;
}
