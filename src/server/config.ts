export const MAX_STORAGE_LIMIT = 50 * 1024 * 1024; // 50 MB

export const MAX_FILE_SIZE_MB = 4;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const MAX_FILE_SIZE_CONFIG = { maxFileSize: `${MAX_FILE_SIZE_MB}MB` };

export const UPLOADTHING_ACCEPTED_MIME_TYPES = {
  // Images
  "image/jpeg": MAX_FILE_SIZE_CONFIG,
  "image/png": MAX_FILE_SIZE_CONFIG,
  "image/gif": MAX_FILE_SIZE_CONFIG,
  "image/webp": MAX_FILE_SIZE_CONFIG,
  "image/svg+xml": MAX_FILE_SIZE_CONFIG,

  // Documents
  "application/pdf": MAX_FILE_SIZE_CONFIG,
  "application/msword": MAX_FILE_SIZE_CONFIG, // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    MAX_FILE_SIZE_CONFIG, // .docx
  "text/plain": MAX_FILE_SIZE_CONFIG, // .txt
  "text/csv": MAX_FILE_SIZE_CONFIG, // .csv
  "application/rtf": MAX_FILE_SIZE_CONFIG, // .rtf

  // Spreadsheets
  "application/vnd.ms-excel": MAX_FILE_SIZE_CONFIG, // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    MAX_FILE_SIZE_CONFIG, // .xlsx

  // Presentations
  "application/vnd.ms-powerpoint": MAX_FILE_SIZE_CONFIG, // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    MAX_FILE_SIZE_CONFIG, // .pptx

  // Audio (Example - adjust size limits if needed)
  "audio/mpeg": { maxFileSize: "10MB" }, // .mp3
  "audio/ogg": { maxFileSize: "10MB" }, // .ogg
  "audio/wav": { maxFileSize: "20MB" }, // .wav

  // Video (Example - adjust size limits if needed)
  "video/mp4": { maxFileSize: "50MB" }, // .mp4
  "video/webm": { maxFileSize: "50MB" }, // .webm

  // Archives (Example - use with caution)
  "application/zip": MAX_FILE_SIZE_CONFIG,
  "application/x-rar-compressed": MAX_FILE_SIZE_CONFIG,
};

// Configuration for client-side dropzone accept prop
// Should generally mirror the keys from UPLOADTHING_ACCEPTED_MIME_TYPES
export const CLIENT_ACCEPTED_MIME_TYPES = Object.keys(
  UPLOADTHING_ACCEPTED_MIME_TYPES,
);

// Helper function to generate a user-friendly list of supported types
export const getSupportedFileTypesDescription = (): string => {
  return "Images (JPG, PNG, GIF, WEBP, SVG), Documents (PDF, DOC, DOCX, TXT, CSV, RTF), Spreadsheets (XLS, XLSX), Presentations (PPT, PPTX) and Audio/Video (MP3, OGG, WAV, MP4, WEBM)";
};
