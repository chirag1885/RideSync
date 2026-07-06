import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { createReviewApi } from "../lib/reviewApi";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideRequestId: string;
  revieweeId: string;
  revieweeName: string;
  chatId: string;
}

const tagOptions = [
  { value: "friendly", label: "Friendly" },
  { value: "on_time", label: "On Time" },
  { value: "safe", label: "Safe" },
  { value: "good_communication", label: "Good Communication" },
  { value: "would_travel_again", label: "Would travel again" },
];

export default function ReviewModal({
  isOpen,
  onClose,
  rideRequestId,
  revieweeId,
  revieweeName,
  chatId,
}: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const reviewMutation = useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewableParticipants", chatId] });
      onClose();
      setRating(0);
      setReviewText("");
      setSelectedTags([]);
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    reviewMutation.mutate({
      rideRequestId,
      revieweeId,
      rating,
      reviewText: reviewText.trim() || undefined,
      tags: selectedTags,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
                Review {revieweeName}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-5">
              How was your experience sharing this ride?
            </p>

            <div className="flex justify-center gap-1 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-surface-300 dark:text-surface-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tagOptions.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => toggleTag(tag.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                    selectedTags.includes(tag.value)
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : "border-surface-300 dark:border-surface-700 text-surface-500 dark:text-surface-400"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Optional: share more about your experience"
              className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
            />

            {reviewMutation.isError && (
              <p className="text-red-500 text-sm mb-3">
                {(reviewMutation.error as any)?.response?.data?.message || "Failed to submit review"}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || reviewMutation.isPending}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
            >
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}