import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GEDProvider } from './context/GEDContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DocumentList from './pages/DocumentList';
import Upload from './pages/Upload';
import Users from './pages/Users';
import History from './pages/History';
import Search from './pages/Search';
import Settings from './pages/Settings';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GEDProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/livres" element={<DocumentList category="Livres" />} />
            <Route path="/dossiers" element={<DocumentList category="Dossiers" />} />
            <Route path="/recherche" element={<Search />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/utilisateurs" element={<Users />} />
            <Route path="/downloads" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </GEDProvider>
  );
};

export default App;