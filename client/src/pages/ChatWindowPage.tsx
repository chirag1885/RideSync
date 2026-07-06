import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Star, Phone, Mail, GraduationCap } from "lucide-react";
import { getChatMessagesApi, sendMessageApi, getChatContactApi } from "../lib/chatApi";
import { useAuth } from "../context/AuthContext";
import { getReviewableParticipantsApi } from "../lib/reviewApi";
import ReviewModal from "../components/ReviewModal";

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
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: () => getChatMessagesApi(chatId!),
    enabled: !!chatId,
    refetchInterval: 3000,
  });

  const { data: reviewableData } = useQuery({
    queryKey: ["reviewableParticipants", chatId],
    queryFn: () => getReviewableParticipantsApi(chatId!),
    enabled: !!chatId,
  });

  const { data: contactData } = useQuery({
    queryKey: ["chatContact", chatId],
    queryFn: () => getChatContactApi(chatId!),
    enabled: !!chatId,
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessageApi(chatId!, text),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["chatMessages", chatId] });
    },
  });

  const messages: MessageData[] = data?.data?.messages || [];
  const contact = contactData?.data?.contact;

  const canReview = (reviewableData?.data?.pendingReviewIds?.length || 0) > 0;
  const revieweeId = reviewableData?.data?.pendingReviewIds?.[0];
  const rideRequestId = reviewableData?.data?.rideRequestId;
  const otherPersonName =
    messages.find((m) => m.sender?._id === revieweeId)?.sender?.name || "them";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMutation.mutate(content.trim());
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col transition-colors">
      <div className="max-w-2xl w-full mx-auto flex flex-col h-screen bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl shadow-xl">
        <div className="border-b border-surface-200 dark:border-surface-800 p-4 flex items-center gap-3">
          <Link
            to="/chats"
            className="w-9 h-9 flex items-center justify-center rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-50 flex-1">Chat</p>
          {canReview && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full"
            >
              <Star className="w-3.5 h-3.5" />
              Leave Review
            </button>
          )}
        </div>

        {contact && (
          <div className="border-b border-surface-200 dark:border-surface-800 p-4 bg-surface-50/50 dark:bg-surface-800/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-surface-900 dark:text-surface-50 text-sm">{contact.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3 h-3" />
                  {contact.branch}, Year {contact.year} · {contact.gender}
                </p>
              </div>
             <div className="flex gap-2 shrink-0">
  <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition">
    <Phone className="w-4 h-4" />
  </a>
  <a href={`mailto:${contact.email}`} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition">
    <Mail className="w-4 h-4" />
  </a>
</div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <p className="text-surface-500 dark:text-surface-400 text-sm text-center">
              Loading messages...
            </p>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMine = msg.sender?._id === user?.id;
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine
                        ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-br-md"
                        : "bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-50 rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isMine ? "text-brand-100" : "text-surface-400 dark:text-surface-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-surface-200 dark:border-surface-800 p-4 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={sendMutation.isPending || !content.trim()}
            className="w-11 h-11 shrink-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white rounded-xl shadow-md shadow-brand-500/25 transition"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>

      {revieweeId && rideRequestId && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          rideRequestId={rideRequestId}
          revieweeId={revieweeId}
          revieweeName={otherPersonName}
          chatId={chatId!}
        />
      )}
    </div>
  );
}