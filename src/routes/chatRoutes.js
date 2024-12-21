import express from "express";
import { createChat, getChatByUserId, updateChatMessages } from "../controllers/chatController.js";


const router = express.Router();

router.get("/:userId/:contactId", getChatByUserId);


router.put("/:userId/:contactId", updateChatMessages);


router.post("/", createChat);

export default router;
