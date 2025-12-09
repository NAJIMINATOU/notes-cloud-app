import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Save } from 'lucide-react';

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes:', e);
      }
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title || !content) return;
    
    setIsLoading(true);

    const newNote = {
      id: Date.now(),
      title,
      content,
      image: imagePreview,
      createdAt: new Date().toISOString()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    setTitle('');
    setContent('');
    setImagePreview('');
    setIsLoading(false);
  };

  const handleDelete = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>
            📝 Gestionnaire de Notes Cloud
          </h1>
          <p style={{ color: '#6B7280' }}>Application migrée vers le Cloud ☁️</p>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Form Column */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={24} />
              Nouvelle Note
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Title Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Titre
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px' }}
                  placeholder="Titre de la note..."
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Contenu
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '10px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', resize: 'none' }}
                  placeholder="Écrivez votre note ici..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Image (optionnelle)
                </label>
                <div style={{ border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: '160px', margin: '0 auto', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
                        <Upload style={{ color: '#9CA3AF', marginBottom: '8px' }} size={32} />
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                          Cliquez pour ajouter une image
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!title || !content || isLoading}
                style={{ 
                  width: '100%', 
                  background: (!title || !content || isLoading) ? '#9CA3AF' : '#2563EB', 
                  color: 'white', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  border: 'none',
                  cursor: (!title || !content || isLoading) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <span>Enregistrement...</span>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer la note
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notes List Column */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
              Mes Notes ({notes.length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
              {notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div>
                  <p style={{ fontSize: '18px', fontWeight: '500' }}>Aucune note pour le moment</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>Créez votre première note !</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', background: '#F9FAFB' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '18px', color: '#1F2937', flex: 1 }}>
                        {note.title}
                      </h3>
                      <button
                        onClick={() => handleDelete(note.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginLeft: '8px' }}
                        title="Supprimer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <p style={{ color: '#4B5563', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                    
                    {note.image && (
                      <img
                        src={note.image}
                        alt={note.title}
                        style={{ width: '100%', borderRadius: '8px', maxHeight: '192px', objectFit: 'cover', marginBottom: '8px' }}
                      />
                    )}
                    
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
                      {new Date(note.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            ☁️ <strong>Hébergé sur le Cloud</strong> • 
            Frontend: Vercel/AWS Amplify • Backend: Render/AWS • 
            Base de données: MongoDB Atlas
          </p>
        </div>
      </div>
    </div>
  );
}