import express from "express";
import { createChat, getChat, updateChatMessages } from "../controllers/chatController.js";


const router = express.Router();

router.get("/:contactId", getChat);


router.put("/:contactId", updateChatMessages);


router.post("/", createChat);

export default router;
