const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  // Video
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

export interface FileValidationError {
  code: 'SIZE_LIMIT' | 'INVALID_TYPE' | 'MULTIPLE_ERRORS';
  message: string;
}

export function validateFile(file: File): FileValidationError | null {
  const errors: FileValidationError[] = [];

  if (file.size > MAX_FILE_SIZE) {
    errors.push({
      code: 'SIZE_LIMIT',
      message: `File size exceeds 10MB limit`,
    });
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push({
      code: 'INVALID_TYPE',
      message: `File type ${file.type} is not supported`,
    });
  }

  if (errors.length === 0) {
    return null;
  }

  if (errors.length === 1) {
    return errors[0];
  }

  return {
    code: 'MULTIPLE_ERRORS',
    message: 'File validation failed: ' + errors.map(e => e.message).join(', '),
  };
} 