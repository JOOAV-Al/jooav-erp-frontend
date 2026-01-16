export interface CreateFilePayload {
  file?: File;
  fileName?: string;
}

export interface FileDataProps {
  url: string;
  publicId: string;
  title?: string;
  bytes?: number;
  fileType?: string;
  extension?: string;
  uploading?: boolean;
}