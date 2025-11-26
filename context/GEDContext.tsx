import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, User, HistoryLog, CategoryNode, UserRole } from '../types';
import { INITIAL_DOCUMENTS, INITIAL_USERS, INITIAL_HISTORY, INITIAL_CATEGORIES } from '../mockData';

interface GEDContextType {
  documents: Document[];
  users: User[];
  history: HistoryLog[];
  categories: CategoryNode[];
  currentUser: User;
  addDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  addHistoryLog: (log: Omit<HistoryLog, 'id' | 'timestamp'>) => void;
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const GEDContext = createContext<GEDContextType | undefined>(undefined);

export const GEDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [history, setHistory] = useState<HistoryLog[]>(INITIAL_HISTORY);
  const [categories] = useState<CategoryNode[]>(INITIAL_CATEGORIES);
  
  // Simulate logged-in user (Admin by default for demo)
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const deleteDocument = (id: string) => {
      setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addHistoryLog = (log: Omit<HistoryLog, 'id' | 'timestamp'>) => {
    const newLog: HistoryLog = {
      ...log,
      id: `h${Date.now()}`,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newLog, ...prev]);
  };

  return (
    <GEDContext.Provider value={{ 
      documents, 
      users, 
      history, 
      categories, 
      currentUser, 
      addDocument, 
      deleteDocument,
      addHistoryLog,
      setCurrentUser,
      addUser,
      deleteUser
    }}>
      {children}
    </GEDContext.Provider>
  );
};

export const useGED = () => {
  const context = useContext(GEDContext);
  if (!context) {
    throw new Error('useGED must be used within a GEDProvider');
  }
  return context;
};