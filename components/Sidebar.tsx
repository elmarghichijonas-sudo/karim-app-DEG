import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Folder, Search, UploadCloud, Users, History, Settings as SettingsIcon, Library } from 'lucide-react';
import { useGED } from '../context/GEDContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { currentUser } = useGED();
  const isAdmin = currentUser.role === UserRole.ADMIN;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 flex items-center gap-2 border-b border-slate-800">
        <Library className="w-8 h-8 text-blue-500" />
        <span className="text-xl font-bold text-white">SmartGED</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to="/" className={navItemClass}>
          <LayoutDashboard size={20} />
          <span>Accueil</span>
        </NavLink>
        
        <div className="pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Bibliothèque
        </div>
        <NavLink to="/livres" className={navItemClass}>
          <Book size={20} />
          <span>Livres</span>
        </NavLink>
        <NavLink to="/dossiers" className={navItemClass}>
          <Folder size={20} />
          <span>Dossiers</span>
        </NavLink>

        <div className="pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Outils
        </div>
        <NavLink to="/recherche" className={navItemClass}>
          <Search size={20} />
          <span>Recherche</span>
        </NavLink>
        <NavLink to="/downloads" className={navItemClass}>
          <History size={20} />
          <span>Téléchargements</span>
        </NavLink>
        
        {isAdmin && (
          <NavLink to="/upload" className={navItemClass}>
            <UploadCloud size={20} />
            <span>Upload</span>
          </NavLink>
        )}

        {isAdmin && (
            <>
                <div className="pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Administration
                </div>
                <NavLink to="/utilisateurs" className={navItemClass}>
                  <Users size={20} />
                  <span>Utilisateurs</span>
                </NavLink>
                <NavLink to="/settings" className={navItemClass}>
                  <SettingsIcon size={20} />
                  <span>Paramètres</span>
                </NavLink>
            </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{currentUser.name}</span>
            <span className="text-xs text-slate-500">{currentUser.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;