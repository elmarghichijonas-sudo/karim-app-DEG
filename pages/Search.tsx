import React, { useState } from 'react';
import { useGED } from '../context/GEDContext';
import { Search as SearchIcon, Sparkles, Filter, X } from 'lucide-react';
import { chatWithGED } from '../services/geminiService';
import { FileType } from '../types';

const Search: React.FC = () => {
  const { documents, categories } = useGED();
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Derived lists for filters
  const authors = Array.from(new Set(documents.map(d => d.author)));
  const years = Array.from(new Set(documents.map(d => d.uploadDate.split('-')[0]))).sort().reverse();

  // Search Logic
  const filteredDocuments = documents.filter(doc => {
    const matchQuery = query === '' || 
      doc.title.toLowerCase().includes(query.toLowerCase()) || 
      doc.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()));
    
    const matchCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchAuthor = selectedAuthor === 'All' || doc.author === selectedAuthor;
    const matchType = selectedType === 'All' || doc.type === selectedType;
    const matchYear = selectedYear === 'All' || doc.uploadDate.startsWith(selectedYear);

    return matchQuery && matchCategory && matchAuthor && matchType && matchYear;
  });

  // AI Search
  const handleSmartSearch = async () => {
    if (!query) return;
    setIsThinking(true);
    setAiResponse('');
    
    // Call Gemini Service with filtered documents context
    const answer = await chatWithGED(query, filteredDocuments);
    
    setAiResponse(answer);
    setIsThinking(false);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedAuthor('All');
    setSelectedType('All');
    setSelectedYear('All');
    setAiResponse('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Recherche Avancée</h1>
        <p className="text-slate-500">Trouvez un document par critères précis ou demandez à l'IA.</p>
      </div>

      {/* Main Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
             <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Rechercher par titre, mot-clé..."
            />
          </div>
          <button 
            onClick={handleSmartSearch}
            disabled={!query || isThinking}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles size={20} />
            {isThinking ? 'Analyse...' : 'Smart Search'}
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
           
           <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Catégorie</label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="All">Toutes</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
           </div>

           <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Auteur</label>
              <select 
                value={selectedAuthor} 
                onChange={e => setSelectedAuthor(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="All">Tous</option>
                {authors.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
           </div>

           <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Type de fichier</label>
              <select 
                value={selectedType} 
                onChange={e => setSelectedType(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="All">Tous</option>
                <option value={FileType.PDF}>PDF</option>
                <option value={FileType.DOCX}>DOCX</option>
                <option value={FileType.IMAGE}>IMAGE</option>
              </select>
           </div>

           <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Année</label>
              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="All">Toutes</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
           </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-slate-500">{filteredDocuments.length} document(s) trouvé(s)</span>
            <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                <X size={14} /> Réinitialiser les filtres
            </button>
        </div>
      </div>

      {/* AI Response Area */}
      {aiResponse && (
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold">
            <Sparkles size={18} />
            <span>Réponse de l'Assistant</span>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {filteredDocuments.map(doc => (
          <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                     doc.category === 'Livres' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                 }`}>{doc.category}</span>
                 <span className="text-slate-300">|</span>
                 <span className="text-xs text-slate-500 font-medium">{doc.subcategory}</span>
              </div>
              <h3 className="font-medium text-slate-800 text-lg">{doc.title}</h3>
              <p className="text-sm text-slate-500">Par {doc.author} • {doc.uploadDate}</p>
              <div className="flex gap-2 mt-2">
                {doc.keywords.slice(0, 4).map(k => (
                  <span key={k} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">#{k}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">{doc.type}</span>
                <span className="text-xs text-slate-400">v{doc.version}</span>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
                <Filter size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500">Aucun résultat ne correspond à vos filtres.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Search;