import React from 'react';
import { useGED } from '../context/GEDContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Upload, Clock, Info } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { documents, history } = useGED();

  // Stats
  const totalDocs = documents.length;
  const totalBooks = documents.filter(d => d.category === 'Livres').length;
  const totalFolders = documents.filter(d => d.category === 'Dossiers').length;
  const recentDownloads = history.filter(h => h.action === 'DOWNLOAD').length;
  const lastActivity = history.length > 0 ? history[0].timestamp : 'Aucune';

  // Chart Data Preparation
  const categoryData = [
    { name: 'Livres', value: totalBooks },
    { name: 'Dossiers', value: totalFolders }
  ];

  const subCategoryData = documents.reduce((acc: any[], doc) => {
    const key = doc.subcategory;
    const existing = acc.find(i => i.name === key);
    if (existing) existing.count += 1;
    else acc.push({ name: key, count: 1 });
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Présentation du GED */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Info size={32} className="text-blue-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-2">Bienvenue sur votre GED</h1>
                <p className="text-slate-300 max-w-2xl leading-relaxed">
                    Cette plateforme de Gestion Électronique de Documents centralise tous vos fichiers importants. 
                    Naviguez facilement entre vos <span className="text-white font-semibold">Livres</span> et <span className="text-white font-semibold">Dossiers</span>, 
                    effectuez des recherches intelligentes assistées par IA, et suivez l'activité de votre organisation en temps réel.
                </p>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Livres</p>
            <p className="text-2xl font-bold text-slate-800">{totalBooks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Dossiers</p>
            <p className="text-2xl font-bold text-slate-800">{totalFolders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Download size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Téléchargements</p>
            <p className="text-2xl font-bold text-slate-800">{recentDownloads}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Dernière activité</p>
            <p className="text-xs font-semibold text-slate-800 truncate w-32" title={lastActivity}>{lastActivity}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Répartition Livres vs Dossiers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-slate-600">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Documents par Sous-catégorie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subCategoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nouvelles mises à jour</h3>
        <div className="space-y-4">
          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="flex items-start justify-between border-b border-slate-50 last:border-0 pb-3 last:pb-0">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{doc.title}</h4>
                  <p className="text-sm text-slate-500">Ajouté par {doc.author} dans <span className="text-blue-600">{doc.subcategory}</span></p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{doc.uploadDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;