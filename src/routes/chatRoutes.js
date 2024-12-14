import express from "express";
import { createChat, getChatByUserId, updateChatMessages } from "../controllers/chatController.js";


const router = express.Router();

// Obtener chat por ID
router.get("/:id", getChatByUserId);

// Actualizar mensajes en un chat
router.put("/:id", updateChatMessages);

// Crear un nuevo chat
router.post("/", createChat);

export default router;
