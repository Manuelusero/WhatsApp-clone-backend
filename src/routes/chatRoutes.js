import express from "express";
import { createChat, getChat, updateChatMessages } from "../controllers/chatController.js";


const router = express.Router();

router.get("/:userId/:contactId", getChat);


router.put("/:userId/:contactId", updateChatMessages);


router.post("/", createChat);

export default router;
