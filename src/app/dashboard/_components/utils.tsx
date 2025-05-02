import {
  Archive,
  FileCode,
  FileIcon,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Music,
  Video,
} from "lucide-react";

export const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "doc":
    case "docx":
      return <FileText className="h-6 w-6 text-blue-700" />;
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css":
      return <FileCode className="h-6 w-6 text-yellow-600" />;
    case "mp3":
    case "wav":
      return <Music className="h-6 w-6 text-purple-500" />;
    case "mp4":
    case "mov":
      return <Video className="h-6 w-6 text-pink-500" />;
    case "zip":
    case "rar":
      return <Archive className="h-6 w-6 text-gray-600" />;
    default:
      return <FileIcon className="h-6 w-6 text-gray-500" />;
  }
};
