import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export const getMyChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ participants: req.user?.userId })
      .populate("participants", "name profilePicture")
      .populate("rideRequest", "pickup destination travelDateTime")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ chats });
  } catch (error) {
    console.error("Get my chats error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some((p) => p.toString() === req.user?.userId);
    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Get chat messages error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some((p) => p.toString() === req.user?.userId);
    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

const message = await Message.create({
  chat: chatId as string,
  sender: req.user?.userId as string,
  content: content.trim(),
});

    chat.updatedAt = new Date();
    await chat.save();

    const populatedMessage = await message.populate("sender", "name profilePicture");

    return res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};