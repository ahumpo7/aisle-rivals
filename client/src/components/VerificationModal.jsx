import React, { useState } from 'react';
import { Check, X, ShieldAlert, Sparkles, MessageSquare, AlertTriangle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function VerificationModal({ request, onVerify, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(false);

  if (!request) return null;

  const { submission, promptTitle, promptIcon, playerName, playerId, promptId, points = 100 } = request;

  const quickChips = [
    'Legit find! 🏆',
    'Cursed! 💀',
    'Cheating! 😂',
    'Too weak, redo! 👎',
    'Pure art! 🎨'
  ];

  const handleApprove = () => {
    setIsSubmitting(true);
    sounds.playApproved();

    // Burst confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onVerify({
      targetPlayerId: playerId,
      promptId: promptId || submission?.promptId,
      approved: true,
      feedback: feedback.trim() || 'Approved! Great find!'
    });
  };

  const handleReject = () => {
    setIsSubmitting(true);
    sounds.playRejected();

    onVerify({
      targetPlayerId: playerId,
      promptId: promptId || submission?.promptId,
      approved: false,
      feedback: feedback.trim() || 'Rejected! Try finding a better one!'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-400/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Urgent Attention Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 border-b border-amber-400/30 flex items-center justify-between sticky top-0 rounded-t-3xl backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-black tracking-wider uppercase text-amber-300">
              🚨 PARTNER EVIDENCE INSPECTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Submitter & Item Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{promptIcon || '📸'}</span>
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  Submitted by <b className="text-white">{playerName}</b>
                </div>
                <h3 className="text-lg font-black text-white">{promptTitle}</h3>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black text-xs border border-amber-400/40">
                +{points} PTS
              </span>
            </div>
          </div>

          {/* Photo Evidence */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-72 border border-slate-700 shadow-inner group">
            <img
              src={submission?.photoUrl}
              alt="Partner proof"
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => setFullscreenPhoto(true)}
            />
            <button
              onClick={() => setFullscreenPhoto(true)}
              className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-slate-200 text-xs font-medium flex items-center gap-1 backdrop-blur"
            >
              <Eye className="w-3.5 h-3.5" /> Fullscreen
            </button>
          </div>

          {/* Partner's Caption */}
          {submission?.caption && (
            <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 space-y-1">
              <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> {playerName}'s Defense:
              </div>
              <p className="text-white font-medium italic text-sm">
                "{submission.caption}"
              </p>
            </div>
          )}

          {/* Quick judgment feedback chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Reaction / Feedback Note
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setFeedback(chip);
                    sounds.playDing();
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    feedback === chip
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Or type a custom note..."
              maxLength={80}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Big Decision Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleReject}
              className="py-3.5 px-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              <X className="w-4 h-4 text-rose-400" /> REJECT FIND
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleApprove}
              className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 hover:brightness-110 transition disabled:opacity-50"
            >
              <Check className="w-5 h-5" /> APPROVE PROOF!
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-2"
          onClick={() => setFullscreenPhoto(false)}
        >
          <img
            src={submission?.photoUrl}
            alt="Fullscreen evidence"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setFullscreenPhoto(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
