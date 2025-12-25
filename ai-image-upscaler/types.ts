export type ProcessStatus = 'queued' | 'processing' | 'done' | 'error';

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSrc: string;
  upscaledSrc: string | null;
  status: ProcessStatus;
  error: string | null;
  dimensions: { width: number; height: number; };
  size: number; // in bytes
  originalBlob: Blob;
  upscaledBlob: Blob | null;
}

export type ScaleFactor = 2 | 4 | 8 | 16;
export type DPI = 72 | 150 | 300 | 600;
export type OutputFormat = 'PNG' | 'JPEG' | 'PDF';

export interface Settings {
    scale: ScaleFactor;
    dpi: DPI;
    enhancements: {
        sharpness: boolean;
        noiseReduction: boolean;
        faceRestore: boolean;
        textureBoost: boolean;
    };
    outputFormat: OutputFormat;
    jpegQuality: number; // 0-1
}


export interface Progress {
    total: number;
    completed: number;
    currentFile: string;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}