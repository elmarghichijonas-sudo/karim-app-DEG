import React, { useState } from 'react';
import { useGED } from '../context/GEDContext';
import { UserRole, User } from '../types';
import { Plus, Trash2, X, Check } from 'lucide-react';

const Users: React.FC = () => {
  const { users, currentUser, addUser, deleteUser } = useGED();
  const [showModal, setShowModal] = useState(false);
  
  // New user state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.MEMBER);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newEmail) {
        const newUser: User = {
            id: `u_${Date.now()}`,
            name: newName,
            email: newEmail,
            role: newRole,
            avatar: `https://picsum.photos/seed/${newName}/200`,
            password: 'password123' // Default password
        };
        addUser(newUser);
        setShowModal(false);
        setNewName('');
        setNewEmail('');
    }
  };

  return (
    <div className="space-y-6 relative">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestion des Utilisateurs</h1>
        {currentUser.role === UserRole.ADMIN && (
            <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm"
            >
                <Plus size={16} /> Ajouter
            </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Utilisateur</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Rôle</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                            <img src={user.avatar} className="w-8 h-8 rounded-full bg-slate-200" alt="" />
                            <span className="font-medium text-slate-800">{user.name}</span>
                        </td>
                        <td className="p-4 text-slate-500">{user.email}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                user.role === UserRole.MEMBER ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                             {currentUser.role === UserRole.ADMIN && user.id !== currentUser.id && (
                                <button 
                                    onClick={() => deleteUser(user.id)}
                                    className="text-slate-400 hover:text-red-600 text-sm font-medium p-2 hover:bg-red-50 rounded"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                             )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Ajouter un utilisateur</h3>
                    <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                        <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="w-full p-2 border border-slate-200 rounded-lg">
                            <option value={UserRole.MEMBER}>Membre</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                            <option value={UserRole.GUEST}>Invité</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 mt-4">
                        Créer l'utilisateur
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Users;