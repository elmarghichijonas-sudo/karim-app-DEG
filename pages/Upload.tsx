
import React, { useState } from 'react';
import { useGED } from '../context/GEDContext';
import { generateDocumentMetadata } from '../services/geminiService';
import { FileType, Document, UserRole } from '../types';
import { UploadCloud, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';

const Upload: React.FC = () => {
  const { addDocument, addHistoryLog, categories, currentUser } = useGED();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [subcategory, setSubcategory] = useState(categories[0].subcategories[0]);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auth check
  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <AlertCircle size={48} className="mb-4 text-red-400" />
        <p>Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setTitle(f.name.split('.')[0]); // Default title
    }
  };

  const handleAutoGenerate = async () => {
    if (!title) return;
    setIsGenerating(true);
    const meta = await generateDocumentMetadata(title, subcategory);
    setDescription(meta.description);
    setKeywords(meta.keywords.join(', '));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Generate random cover for Livres if uploaded
    let coverUrl = undefined;
    if (category === 'Livres') {
        const seed = title.replace(/\s/g, '');
        coverUrl = `https://picsum.photos/seed/${seed}/300/400`;
    }

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      title,
      type: file.type.includes('pdf') ? FileType.PDF : file.type.includes('image') ? FileType.IMAGE : FileType.DOCX,
      category,
      subcategory,
      author: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      keywords: keywords.split(',').map(k => k.trim()),
      description,
      version: 1.0,
      url: URL.createObjectURL(file), // Mock URL logic
      cover: coverUrl
    };

    addDocument(newDoc);
    addHistoryLog({
      userId: currentUser.id,
      userName: currentUser.name,
      documentId: newDoc.id,
      documentTitle: newDoc.title,
      action: 'UPLOAD'
    });

    setSuccess(true);
    setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setTitle('');
        setDescription('');
        setKeywords('');
    }, 3000);
  };

  // Update subcategories when main category changes
  const activeSubcategories = categories.find(c => c.name === category)?.subcategories || [];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Ajouter un document</h1>
      
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-2">
          <CheckCircle size={20} />
          Document ajouté avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
        
        {/* File Input */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
            <input type="file" id="file" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                <UploadCloud size={40} className="text-blue-500 mb-2" />
                <span className="text-slate-600 font-medium">
                    {file ? file.name : 'Cliquez pour sélectionner un fichier'}
                </span>
                <span className="text-xs text-slate-400 mt-1">PDF, DOCX, Images</span>
            </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select 
                    value={category} 
                    onChange={e => { setCategory(e.target.value); setSubcategory(categories.find(c=>c.name === e.target.value)!.subcategories[0]); }}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sous-catégorie</label>
                <select 
                    value={subcategory} 
                    onChange={e => setSubcategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                >
                    {activeSubcategories.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
            <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
                required 
            />
        </div>

        {/* AI Generator Button */}
        {title && (
             <div className="flex justify-end">
                <button 
                    type="button" 
                    onClick={handleAutoGenerate}
                    disabled={isGenerating}
                    className="text-sm text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700"
                >
                    <Wand2 size={14} />
                    {isGenerating ? 'Génération...' : 'Générer description & mots-clés'}
                </button>
             </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2 border border-slate-200 rounded-lg"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mots-clés (séparés par virgule)</label>
            <input 
                type="text" 
                value={keywords} 
                onChange={e => setKeywords(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
                placeholder="science, physique, 2024"
            />
        </div>

        <button 
            type="submit" 
            disabled={!file}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Uploader le Document
        </button>

      </form>
    </div>
  );
};

export default Upload;
