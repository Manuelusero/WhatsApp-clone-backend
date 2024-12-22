import express from 'express';
import { registerUser, loginUser, verifyUser, getUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authrouter = express.Router();


authrouter.post('/register', registerUser);

authrouter.post('/login', loginUser);

authrouter.get('/', authMiddleware(), getUser);

authrouter.get('/verify/:token', verifyUser);

authrouter.get('/home', authMiddleware(), (req, res) => {
    res.status(200).json({ message: 'Acceso autorizado' });
})



export default authrouter;
