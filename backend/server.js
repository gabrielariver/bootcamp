require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5501;
const TOKEN = process.env.ADMIN_TOKEN;

app.use(cors());
app.use(express.json());

// Esquema de contacto simple
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  created_at: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

const path = require('path');

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Para servir index.html al visitar "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Ruta para guardar contacto
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ ok: true, id: contact._id });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar contacto', error: err.message });
  }
});

// Ruta admin para ver todos los contactos
app.get('/admin/contacts', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const contacts = await Contact.find().sort({ created_at: -1 });
  res.json({ ok: true, data: contacts });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
