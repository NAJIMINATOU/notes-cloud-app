// server.js - Backend Node.js avec Express
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuration Multer pour les images
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Connexion MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Schéma Note
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Base64 ou URL
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// Routes API

// GET - Récupérer toutes les notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une note spécifique
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer une nouvelle note
app.post('/api/notes', upload.single('image'), async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    const newNote = new Note({
      title,
      content,
      image: image || null
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Modifier une note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer une note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '☁️ API Gestionnaire de Notes - Cloud Deployed',
    endpoints: {
      getAllNotes: 'GET /api/notes',
      getNote: 'GET /api/notes/:id',
      createNote: 'POST /api/notes',
      updateNote: 'PUT /api/notes/:id',
      deleteNote: 'DELETE /api/notes/:id'
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});