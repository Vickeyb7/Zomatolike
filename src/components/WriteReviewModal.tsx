import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: {
    rating: number;
    comment: string;
    dishTag?: string;
    userName: string;
  }) => void;
  restaurantName: string;
  menuItems: MenuItem[];
  currentUserName: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  restaurantName,
  menuItems,
  currentUserName,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [dishTag, setDishTag] = useState<string>('diet coke gol gappe');
  const [userName, setUserName] = useState<string>(currentUserName);
  const [customDish, setCustomDish] = useState<string>('');
  const [isCustomDish, setIsCustomDish] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const selectedDish = isCustomDish ? customDish.trim() : dishTag;

    onSubmitReview({
      rating,
      comment: comment.trim(),
      dishTag: selectedDish || undefined,
      userName: userName.trim() || 'Anonymous Diner',
    });

    setComment('');
    onClose();
  };

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return { label: 'Loved it! Exceptional taste & vibe', color: 'text-emerald-400', bg: 'bg-emerald-600' };
      case 4:
        return { label: 'Good experience, tasty dishes', color: 'text-emerald-400', bg: 'bg-emerald-600' };
      case 3:
        return { label: 'Average, has room for improvement', color: 'text-amber-400', bg: 'bg-amber-600' };
      case 2:
        return { label: 'Disappointing food or service', color: 'text-rose-400', bg: 'bg-rose-600' };
      case 1:
        return { label: 'Poor taste, would not recommend', color: 'text-rose-500', bg: 'bg-rose-600' };
      default:
        return { label: '', color: 'text-zinc-400', bg: 'bg-zinc-700' };
    }
  };

  const feedback = getRatingFeedback(rating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#14151b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div>
            <h2 id="write-review-title" className="text-base font-semibold text-white">
              Write a Review
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              for <span className="text-zinc-200 font-medium">{restaurantName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Rating Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = rating >= val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-base transition-all ${
                      isSelected
                        ? `${val >= 3 ? 'bg-emerald-600' : 'bg-rose-600'} text-white shadow-md scale-105`
                        : 'bg-zinc-800/80 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
              <div className="ml-3">
                <span className={`text-xs font-medium block ${feedback.color}`}>
                  {feedback.label}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {rating} / 5 stars
                </span>
              </div>
            </div>
          </div>

          {/* Dish Tag */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Dish You Tasted
              </label>
              <button
                type="button"
                onClick={() => setIsCustomDish(!isCustomDish)}
                className="text-xs text-rose-400 hover:underline"
              >
                {isCustomDish ? 'Pick from menu' : 'Enter custom item'}
              </button>
            </div>

            {isCustomDish ? (
              <input
                type="text"
                value={customDish}
                onChange={(e) => setCustomDish(e.target.value)}
                placeholder="e.g. Diet Coke Gol Gappe, Palak Chai"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            ) : (
              <select
                value={dishTag}
                onChange={(e) => setDishTag(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                <option value="diet coke gol gappe">diet coke gol gappe</option>
                <option value="palak chai">palak chai</option>
                <option value="Strawberry maggi">Strawberry maggi</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} (₹{item.price})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Review Comments
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What made this dish standout or fall short? Share your honest review..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Short, punchy reviews match the Zomato Lite review stream.
            </p>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Reviewer Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
