
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export enum FileType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  IMAGE = 'IMAGE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for schema completeness
  role: UserRole;
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  type: FileType;
  category: string; // e.g., "Livres", "Dossiers"
  subcategory: string; // e.g., "Science", "Projets"
  author: string;
  uploadDate: string;
  size: string;
  keywords: string[];
  description: string;
  version: number;
  url?: string; // Mock URL
  cover?: string; // URL for book cover
}

export interface HistoryLog {
  id: string;
  userId: string;
  userName: string;
  documentId: string;
  documentTitle: string;
  action: 'UPLOAD' | 'DOWNLOAD' | 'VIEW' | 'EDIT';
  timestamp: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  subcategories: string[];
}
