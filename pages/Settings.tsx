import React, { useState } from 'react';
import { Save, Shield, Database, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const [versioning, setVersioning] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState('daily');

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <div className="border-b border-slate-200 pb-4">
           <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>
           <p className="text-slate-500">Configuration générale du système GED.</p>
       </div>

       {/* Configuration Section */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
                <Shield size={18} />
                Gestion des Documents
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-800">Versioning des documents</h3>
                        <p className="text-sm text-slate-500">Conserver l'historique des versions lors des modifications.</p>
                    </div>
                    <button 
                        onClick={() => setVersioning(!versioning)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${versioning ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${versioning ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>
       </div>

        {/* Backup Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
                <Database size={18} />
                Sauvegarde & Sécurité
            </div>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-slate-800">Sauvegarde Automatique</h3>
                        <p className="text-sm text-slate-500">Créer des copies de sécurité régulièrement.</p>
                    </div>
                    <button 
                        onClick={() => setAutoBackup(!autoBackup)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${autoBackup ? 'bg-green-600' : 'bg-slate-200'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${autoBackup ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>

                {autoBackup && (
                    <div className="pl-4 border-l-2 border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Fréquence de sauvegarde</label>
                        <select 
                            value={backupFreq}
                            onChange={(e) => setBackupFreq(e.target.value)}
                            className="w-full md:w-64 p-2 border border-slate-200 rounded-lg bg-white"
                        >
                            <option value="daily">Quotidienne (00:00)</option>
                            <option value="weekly">Hebdomadaire (Dimanche)</option>
                            <option value="monthly">Mensuelle (1er du mois)</option>
                        </select>
                    </div>
                )}
            </div>
       </div>

        {/* Actions */}
       <div className="flex justify-end gap-4">
           <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2">
               <RotateCcw size={18} /> Rétablir
           </button>
           <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
               <Save size={18} /> Enregistrer
           </button>
       </div>

    </div>
  );
};

export default Settings;