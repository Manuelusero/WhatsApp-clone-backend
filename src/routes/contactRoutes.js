import express from 'express';
import { createContact, getContacts } from '../controllers/contactController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.get('/', authMiddleware(), getContacts);

router.post('/', authMiddleware(), upload.single('image'), createContact); // Subida de imagen

export default router;
