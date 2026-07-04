import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatMessagesApi, sendMessageApi } from "../lib/chatApi";
import { useAuth } from "../context/AuthContext";

interface MessageData {
  _id: string;
  content: string;
  createdAt: string;
  sender: { _id: string; name: string };
}

export default function ChatWindowPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: () => getChatMessagesApi(chatId!),
    enabled: !!chatId,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessageApi(chatId!, text),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["chatMessages", chatId] });
    },
  });

  const messages: MessageData[] = data?.data?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMutation.mutate(content.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-xl w-full mx-auto flex flex-col h-screen bg-white shadow-md">
        <div className="border-b border-gray-200 p-4">
          <Link to="/chats" className="text-sm text-purple-600 hover:underline">
            ← Back to Chats
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && <p className="text-gray-500 text-sm text-center">Loading messages...</p>}

          {messages.map((msg) => {
            const isMine = msg.sender?._id === user?.id;
            return (
              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMine ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-purple-200" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-gray-200 p-4 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={sendMutation.isPending || !content.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2 text-sm transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}