import fs from "fs";
import { PDFParse } from "pdf-parse";

/**
 * Normalizes extracted text: cleans whitespace, eliminates carriage returns,
 * strips repetitive excessive blanks while preserving paragraph structure.
 */
export function normalizeExtractedText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Parses and extracts machine-readable text from an uploaded PDF notification.
 * 
 * Accurately detects scanned/no-text PDFs without falsely claiming OCR was performed.
 * 
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<{
 *   success: boolean,
 *   text: string,
 *   pageCount: number,
 *   hasUsableText: boolean,
 *   ocrRequired: boolean,
 *   warnings: string[],
 *   reason?: string
 * }>}
 */
export async function parseNotificationPdf(filePath) {
  const warnings = [];

  try {
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        text: "",
        pageCount: 0,
        hasUsableText: false,
        ocrRequired: true,
        warnings: ["PDF file not found on server."],
        reason: "File not found.",
      };
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    if (!fileBuffer || fileBuffer.length === 0) {
      return {
        success: false,
        text: "",
        pageCount: 0,
        hasUsableText: false,
        ocrRequired: true,
        warnings: ["Uploaded file is empty (0 bytes)."],
        reason: "Empty file.",
      };
    }

    // Verify basic PDF magic header (%PDF)
    const header = fileBuffer.slice(0, 5).toString("ascii");
    if (!header.startsWith("%PDF")) {
      return {
        success: false,
        text: "",
        pageCount: 0,
        hasUsableText: false,
        ocrRequired: false,
        warnings: ["The uploaded file does not have a valid PDF header."],
        reason: "Invalid PDF format.",
      };
    }

    let parser = null;
    let extractedText = "";
    let pageCount = 1;

    try {
      parser = new PDFParse({ data: fileBuffer });

      // Extract text content
      const textResult = await parser.getText();
      extractedText = textResult?.text || "";

      // Attempt to retrieve page metadata
      if (typeof parser.getInfo === "function") {
        try {
          const info = await parser.getInfo();
          if (info?.pages && typeof info.pages === "number") {
            pageCount = info.pages;
          }
        } catch (_) {}
      }
    } catch (parseError) {
      console.warn("[notificationParserService] PDF parsing encountered an issue:", parseError.message);
      warnings.push(`Parser warning: ${parseError.message}`);
    } finally {
      if (parser && typeof parser.destroy === "function") {
        try {
          await parser.destroy();
        } catch (_) {}
      }
    }

    const normalizedText = normalizeExtractedText(extractedText);

    // Evaluate machine readability heuristic
    const alphanumericCount = normalizedText.replace(/[^a-zA-Z0-9]/g, "").length;
    const hasUsableText = alphanumericCount >= 50;
    const ocrRequired = !hasUsableText;

    if (!hasUsableText) {
      warnings.push(
        "Likely scanned PDF / insufficient machine-readable text detected. OCR may be required."
      );
    }

    return {
      success: true,
      text: normalizedText,
      pageCount: Math.max(1, pageCount),
      hasUsableText,
      ocrRequired,
      warnings,
    };
  } catch (error) {
    console.error("[notificationParserService] Fatal PDF extraction error:", error);
    return {
      success: false,
      text: "",
      pageCount: 0,
      hasUsableText: false,
      ocrRequired: true,
      warnings: ["Unable to extract usable text from PDF.", error.message],
      reason: error.message,
    };
  }
}
