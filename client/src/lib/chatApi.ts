import api from "./axios";

export const getMyChatsApi = () => {
  return api.get("/chats");
};

export const getChatMessagesApi = (chatId: string) => {
  return api.get(`/chats/${chatId}/messages`);
};

export const sendMessageApi = (chatId: string, content: string) => {
  return api.post(`/chats/${chatId}/messages`, { content });
};
export const getChatContactApi = (chatId: string) => {
  return api.get(`/chats/${chatId}/contact`);
};