import express from 'express';
import { registerUser, loginUser, verifyUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authrouter = express.Router();

// Ruta para registrar un usuario
authrouter.post('/register', registerUser);

// Ruta para iniciar sesión
authrouter.post('/login', loginUser);

// Ruta para verificar el token de verificación
authrouter.get('/verify/:token', verifyUser);

authrouter.get('/home', authMiddleware(), (req, res) => {
    res.status(200).json({ message: 'Acceso autorizado' });
})



export default authrouter;
