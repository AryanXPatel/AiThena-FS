// Type definitions for pdf-parse module
declare module 'pdf-parse' {
  interface PDFParseOptions {
    // Add any specific options you need
    max?: number;
    version?: string;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }

  function pdfParse(buffer: Buffer, options?: PDFParseOptions): Promise<PDFParseResult>;
  
  export = pdfParse;
}
