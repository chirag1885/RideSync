import { Router } from "express";
import { getMyChats, getChatMessages, sendMessage, getChatContact } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getMyChats);
router.get("/:chatId/messages", protect, getChatMessages);
router.post("/:chatId/messages", protect, sendMessage);
router.get("/:chatId/contact", protect, getChatContact);

export default router;