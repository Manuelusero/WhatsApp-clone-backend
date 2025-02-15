import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import fs from 'fs';
import chatRoutes from './routes/chatRoutes.js';


dotenv.config();

const app = express();

app.get('/favicon.ico', (req, res) => res.status(204).end());

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const PORT = process.env.PORT || 5002;

const corsOptions = {
    origin:[ 'https://whatsapp-clone-frontend-lilac.vercel.app',
    'http://localhost:5173',
  ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/chats', chatRoutes);   

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Conectado a MongoDB en ${process.env.MONGO_URI}`);
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
  });
