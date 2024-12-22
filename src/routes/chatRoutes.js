import express from "express";
import { createChat, getChat, updateChatMessages } from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:contactId", authMiddleware(), getChat);


router.put("/:contactId", authMiddleware(), updateChatMessages);


router.post("/", authMiddleware(), createChat);

export default router;
