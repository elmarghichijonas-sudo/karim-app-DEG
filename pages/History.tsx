import React from 'react';
import { useGED } from '../context/GEDContext';

const History: React.FC = () => {
  const { history } = useGED();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Historique d'Activité</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {history.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Aucune activité enregistrée.</div>
          ) : (
             <div className="divide-y divide-slate-100">
                 {history.map(log => (
                     <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                         <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${
                                 log.action === 'UPLOAD' ? 'bg-green-500' :
                                 log.action === 'DOWNLOAD' ? 'bg-blue-500' :
                                 log.action === 'VIEW' ? 'bg-gray-500' : 'bg-purple-500'
                             }`} />
                             <div>
                                 <p className="text-sm font-medium text-slate-800">
                                     <span className="font-bold">{log.userName}</span> a {log.action.toLowerCase()} le document <span className="font-bold">{log.documentTitle}</span>
                                 </p>
                                 <p className="text-xs text-slate-500">{log.timestamp}</p>
                             </div>
                         </div>
                         <span className="text-xs text-slate-400 font-mono">ID: {log.documentId}</span>
                     </div>
                 ))}
             </div>
          )}
      </div>
    </div>
  );
};

export default History;
