import { Router } from "express";
import { getMyChats, getChatMessages, sendMessage } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getMyChats);
router.get("/:chatId/messages", protect, getChatMessages);
router.post("/:chatId/messages", protect, sendMessage);

export default router;