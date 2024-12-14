import express from "express";
import { createChat, getChatByUserId, updateChatMessages } from "../controllers/chatController.js";


const router = express.Router();

router.get("/:id", getChatByUserId);


router.put("/:id", updateChatMessages);


router.post("/", createChat);

export default router;
