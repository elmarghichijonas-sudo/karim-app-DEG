
import React, { useState } from 'react';
import { useGED } from '../context/GEDContext';
import { Document, FileType } from '../types';
import { FileText, Image as ImageIcon, File, Eye, Download, Search } from 'lucide-react';

interface DocumentListProps {
  category: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ category }) => {
  const { documents, addHistoryLog, currentUser } = useGED();
  const [filterSub, setFilterSub] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // Filter Logic
  const filteredDocs = documents.filter(doc => {
    const matchCat = doc.category === category;
    const matchSub = filterSub === 'All' || doc.subcategory === filterSub;
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        doc.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSub && matchSearch;
  });

  // Extract unique subcategories for tabs
  const subcategories = ['All', ...Array.from(new Set(documents.filter(d => d.category === category).map(d => d.subcategory)))];

  const handleDownload = (doc: Document) => {
    addHistoryLog({
      userId: currentUser.id,
      userName: currentUser.name,
      documentId: doc.id,
      documentTitle: doc.title,
      action: 'DOWNLOAD'
    });
    alert(`Téléchargement de ${doc.title} lancé...`);
  };

  const handlePreview = (doc: Document) => {
     addHistoryLog({
      userId: currentUser.id,
      userName: currentUser.name,
      documentId: doc.id,
      documentTitle: doc.title,
      action: 'VIEW'
    });
    setPreviewDoc(doc);
  }

  const getIcon = (type: FileType) => {
    switch (type) {
      case FileType.PDF: return <FileText className="text-red-500" />;
      case FileType.DOCX: return <FileText className="text-blue-500" />;
      case FileType.IMAGE: return <ImageIcon className="text-purple-500" />;
      default: return <File className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800">{category}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrer..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subcategories.map(sub => (
          <button
            key={sub}
            onClick={() => setFilterSub(sub)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterSub === sub 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative flex flex-col h-full">
            
            {/* Visual Header: Cover Image or Icon */}
            {doc.cover ? (
               <div className="w-full aspect-[2/3] bg-slate-100 rounded-lg mb-4 overflow-hidden relative shadow-inner">
                  <img src={doc.cover} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                     <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-[10px] rounded font-medium shadow-sm">v{doc.version}</span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                     <div className="p-1.5 bg-white/90 rounded shadow-sm">
                        {getIcon(doc.type)}
                     </div>
                  </div>
               </div>
            ) : (
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    {getIcon(doc.type)}
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">v{doc.version}</span>
                </div>
            )}
            
            <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1 leading-tight line-clamp-2" title={doc.title}>{doc.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{doc.subcategory} • {doc.author}</p>
                
                {!doc.cover && (
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{doc.description}</p>
                )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
              <button 
                onClick={() => handlePreview(doc)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Eye size={16} /> <span className="hidden sm:inline">Aperçu</span>
              </button>
              <button 
                onClick={() => handleDownload(doc)}
                className="flex-none w-10 flex items-center justify-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                title="Télécharger"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>Aucun document trouvé dans cette catégorie.</p>
        </div>
      )}

      {/* Modal Preview */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-lg text-slate-800">{previewDoc.title}</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">Fermer</button>
            </div>
            <div className="p-0 bg-slate-100 flex-1 overflow-y-auto flex">
               {/* Split view for preview if it has a cover */}
               {previewDoc.cover && (
                   <div className="w-1/3 bg-slate-200 hidden md:flex items-center justify-center p-4">
                       <img src={previewDoc.cover} alt="Cover" className="rounded shadow-lg max-w-full max-h-full" />
                   </div>
               )}
               <div className={`p-8 ${previewDoc.cover ? 'md:w-2/3' : 'w-full'} flex items-center justify-center`}>
                   <div className="text-center space-y-4 w-full">
                      <div className="flex justify-center">{getIcon(previewDoc.type)}</div>
                      <p className="text-slate-600">Prévisualisation simulée pour <strong>{previewDoc.title}</strong></p>
                      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm text-left text-sm text-slate-500">
                          <p className="mb-2"><span className="font-semibold text-slate-700">Description:</span> {previewDoc.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                             {previewDoc.keywords.map(k => (
                                 <span key={k} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">#{k}</span>
                             ))}
                          </div>
                          <p><span className="font-semibold text-slate-700">Auteur:</span> {previewDoc.author}</p>
                          <p><span className="font-semibold text-slate-700">Taille:</span> {previewDoc.size}</p>
                      </div>
                   </div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-white">
                <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Fermer</button>
                <button onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2">
                    <Download size={16} /> Télécharger
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
