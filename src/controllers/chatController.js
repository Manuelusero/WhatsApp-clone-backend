import Chats from "../models/Chats.js"; 
import { Router } from "express";
import Contact from "../models/Contact.js";
import mongoose from "mongoose";


const router = Router();


export const getChatByUserId = async (req, res) => {
 
  try {
    const chat = await Chats.findOne({userId: req.params.id})
    .populate("userId", "name image");     

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }
    const responseChat = {
        ...chat._doc,
        name: chat.name || "Chat sin nombre",
        thumbnail: chat.image || "https://via.placeholder.com/150",
      };

    res.json(responseChat);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el chat", error: error.message });
  }
};



export const updateChatMessages = async (req, res) => {
  const { id: userId} = req.params;
  const { messages } = req.body;
  try {
    const updatedChat = await Chats.findOneAndUpdate(
      { userId},
      { $set: { messages } },
      { new: true }
    );
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los mensajes", error: error.message });
  }
};


export const createChat = async (req, res) => {
    console.log("Datos recibidos en la creación del chat:", req.body); 
  const { userId, contactId } = req.body;

  try {   
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
      }

      const contact = await Contact.findById(contactId);  
      if (!contact) {
        return res.status(404).json({ message: "Contacto no encontrado" });
      }

    const existingChat = await Chats.findOne({ userId, contactId });
    if (existingChat) {
      return res.status(400).json({ message: "El chat ya existe para este usuario" });
    }

    const newChat = await Chats.create({
         userId,
         contactId,
         name: contact.name,
         thumbnail: contact.image || "https://via.placeholder.com/50",
         messages: [],
         });


    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el chat", error: error.message });
  }
};

export default router;
