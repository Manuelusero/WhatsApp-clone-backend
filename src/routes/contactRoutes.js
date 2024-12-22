import express from 'express';
import { createContact, getContact, getContacts } from '../controllers/contactController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.get('/', authMiddleware(), getContacts);

router.get('/:contactId', authMiddleware(), getContact);

router.post('/', authMiddleware(), upload.single('image'), createContact);



export default router;
