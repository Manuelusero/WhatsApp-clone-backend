import Chats from "../models/Chats.js"; 
import { Router } from "express";
import Contact from "../models/Contact.js";
import mongoose from "mongoose";


const router = Router();


export const getChat = async (req, res) => {
 
  try {
    const chat = await Chats.findOne({userId: req.user.id, contactId: req.params.contactId});

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }
    res.status(200).json({
      messages:chat.messages,
      name: chat.name || "Chat sin nombre",
      thumbnail: chat.thumbnail || "https://via.placeholder.com/150",
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener el chat", error: error.message });
  }
};



export const updateChatMessages = async (req, res) => {
  const userId = req.user.id;
  const {contactId} = req.params;
  const { messages } = req.body;
  try {
    const updatedChat = await Chats.findOneAndUpdate(
      { userId, contactId},
      { $set: { messages } },
      { new: true }
    );

  console.log(updatedChat);
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar los mensajes", error: error.message });
  }
};


export const createChat = async (req, res) => {
    console.log("Datos recibidos en la creación del chat:", req.body); 
  const userId = req.user.id;
    const {contactId } = req.body;

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
