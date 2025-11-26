
import { Document, FileType, User, UserRole, HistoryLog, CategoryNode } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@ged.com', password: 'admin', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/alice/200' },
  { id: 'u2', name: 'Bob Member', email: 'bob@ged.com', password: 'user', role: UserRole.MEMBER, avatar: 'https://picsum.photos/seed/bob/200' },
  { id: 'u3', name: 'Charlie Guest', email: 'charlie@ged.com', password: 'guest', role: UserRole.GUEST, avatar: 'https://picsum.photos/seed/charlie/200' },
];

export const INITIAL_CATEGORIES: CategoryNode[] = [
  { id: 'livres', name: 'Livres', subcategories: ['Science', 'Histoire', 'Technologie'] },
  { id: 'dossiers', name: 'Dossiers', subcategories: ['Projets', 'Administratif'] },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    title: 'Physique Quantique pour tous',
    type: FileType.PDF,
    category: 'Livres',
    subcategory: 'Science',
    author: 'Albert E.',
    uploadDate: '2023-10-15',
    size: '12 MB',
    keywords: ['physique', 'science', 'quantum'],
    description: 'Introduction aux concepts de base.',
    version: 1.0,
    cover: 'https://picsum.photos/seed/physics/300/400'
  },
  {
    id: 'd2',
    title: 'Histoire de France Vol. 1',
    type: FileType.PDF,
    category: 'Livres',
    subcategory: 'Histoire',
    author: 'Jules Michelet',
    uploadDate: '2023-09-01',
    size: '25 MB',
    keywords: ['france', 'histoire', 'révolution'],
    description: 'Une plongée dans le passé de la France.',
    version: 1.0,
    cover: 'https://picsum.photos/seed/history/300/400'
  },
  {
    id: 'd3',
    title: 'Cahier des charges - Projet Alpha',
    type: FileType.DOCX,
    category: 'Dossiers',
    subcategory: 'Projets',
    author: 'Alice Admin',
    uploadDate: '2023-11-20',
    size: '2 MB',
    keywords: ['projet', 'specs', 'alpha'],
    description: 'Spécifications techniques du projet Alpha.',
    version: 1.2,
  },
  {
    id: 'd4',
    title: 'React Design Patterns',
    type: FileType.PDF,
    category: 'Livres',
    subcategory: 'Technologie',
    author: 'Facebook Team',
    uploadDate: '2024-01-10',
    size: '5 MB',
    keywords: ['code', 'react', 'frontend'],
    description: 'Meilleures pratiques pour le développement React.',
    version: 2.0,
    cover: 'https://picsum.photos/seed/react/300/400'
  },
  {
    id: 'd5',
    title: 'Facture Février 2024',
    type: FileType.PDF,
    category: 'Dossiers',
    subcategory: 'Administratif',
    author: 'Service Compta',
    uploadDate: '2024-02-28',
    size: '0.5 MB',
    keywords: ['facture', 'finance'],
    description: 'Facture mensuelle électricité.',
    version: 1.0,
  },
  {
    id: 'd6',
    title: 'La Révolution Industrielle',
    type: FileType.PDF,
    category: 'Livres',
    subcategory: 'Histoire',
    author: 'Historien X',
    uploadDate: '2022-05-12',
    size: '15 MB',
    keywords: ['industrie', 'histoire', '19eme'],
    description: 'Analyse de la révolution industrielle.',
    version: 1.0,
    cover: 'https://picsum.photos/seed/factory/300/400'
  },
  {
    id: 'd7',
    title: 'Compte Rendu Réunion Mars',
    type: FileType.DOCX,
    category: 'Dossiers',
    subcategory: 'Administratif',
    author: 'Secrétariat',
    uploadDate: '2024-03-01',
    size: '1 MB',
    keywords: ['réunion', 'cr', 'mars'],
    description: 'CR de la réunion mensuelle.',
    version: 1.1,
  }
];

export const INITIAL_HISTORY: HistoryLog[] = [
  { id: 'h1', userId: 'u1', userName: 'Alice Admin', documentId: 'd1', documentTitle: 'Physique Quantique', action: 'UPLOAD', timestamp: '2023-10-15 10:00' },
  { id: 'h2', userId: 'u2', userName: 'Bob Member', documentId: 'd3', documentTitle: 'Cahier des charges', action: 'DOWNLOAD', timestamp: '2023-11-21 14:30' },
  { id: 'h3', userId: 'u1', userName: 'Alice Admin', documentId: 'd5', documentTitle: 'Facture Février 2024', action: 'UPLOAD', timestamp: '2024-02-28 09:15' },
];
