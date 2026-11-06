import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

const PROMPT_ICONS = ['🎯', '✨', '🎁', '🥑', '🧸', '🧦', '☕', '🕶️', '🪴', '🎪'];

export default function AddCustomPromptModal({ onClose, onAddPrompt }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hint, setHint] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [points, setPoints] = useState(150);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playDing();
    onAddPrompt({
      title: title.trim(),
      description: description.trim() || 'Find this custom challenge item!',
      hint: hint.trim(),
      icon,
      points: Number(points) || 150
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-black text-white text-base">Add Couple's Challenge</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Icon selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">Choose Icon</label>
            <div className="flex gap-2 overflow-x-auto py-1">
              {PROMPT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`text-xl p-2 rounded-xl border transition ${
                    icon === ic ? 'bg-amber-400/20 border-amber-400' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">Challenge Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Something That Smells Like My Ex"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">Description / Goal</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you or your partner must hunt down..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Hint */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-400">Store Aisle Hint (Optional)</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g. Garden Center or Candles"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg active:scale-95 transition"
          >
            Add Challenge to Hunt
          </button>
        </form>
      </div>
    </div>
  );
}
