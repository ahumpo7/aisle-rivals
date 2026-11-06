import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, CheckCircle2, AlertCircle, Clock, Send, Sparkles, MapPin, ShieldAlert, ArrowLeft } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { sounds } from '../utils/audio';

export default function SnapModal({ prompt, player, opponent, onClose, onSubmitProof, onSwapPrompt }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const existingSubmission = player?.submissions?.[prompt.id];

  const handleSwapThisPrompt = () => {
    if (window.confirm("Don't like this challenge? Swap it for another one from the deck?")) {
      setIsSwapping(true);
      sounds.playDing();
      onSwapPrompt(prompt.id, () => {
        setIsSwapping(false);
        onClose();
      });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      sounds.playDing();
      setError('');
      // Compress image for lightning fast mobile uploads
      const compressedBlob = await compressImage(file, 1200, 0.78);
      setSelectedImage(compressedBlob);
      const previewUrl = URL.createObjectURL(compressedBlob);
      setImagePreview(previewUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to process image from camera. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please take or choose a photo first!');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      sounds.playDing();

      // Upload via FormData
      const formData = new FormData();
      formData.append('photo', selectedImage, `snap-${prompt.id}.jpg`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!data.success || !data.url) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      // Submit through socket
      onSubmitProof(prompt.id, data.url, caption);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Submission failed. Check your internet connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur z-10 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-1.5 rounded-xl bg-slate-800 border border-slate-700">
              {prompt.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {prompt.category}
                </span>
                <span className="text-[10px] font-black text-amber-400">
                  +{prompt.points} PTS
                </span>
              </div>
              <h2 className="text-base font-black text-white leading-tight mt-0.5">
                {prompt.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Prompt Instructions */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2">
            <p className="text-slate-200 font-medium leading-relaxed">
              {prompt.description}
            </p>
            {prompt.hint && (
              <div className="flex items-start gap-2 pt-2 border-t border-slate-700/60 text-xs text-amber-300">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span><b>Walmart Aisle Hint:</b> {prompt.hint}</span>
              </div>
            )}
            {prompt.verificationCriteria && (
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                <span><b>Partner Verification Rule:</b> {prompt.verificationCriteria}</span>
              </div>
            )}
          </div>

          {/* Existing Status Banner */}
          {existingSubmission && (
            <div className={`p-4 rounded-2xl border ${
              existingSubmission.status === 'approved'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : existingSubmission.status === 'rejected'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {existingSubmission.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {existingSubmission.status === 'rejected' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {existingSubmission.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 animate-spin" />}
                <span>
                  {existingSubmission.status === 'approved' && `Verified by ${existingSubmission.reviewedBy || 'Partner'}! (+${existingSubmission.pointsEarned} pts)`}
                  {existingSubmission.status === 'rejected' && `Rejected by ${existingSubmission.reviewedBy || 'Partner'}! You can retake it below.`}
                  {existingSubmission.status === 'pending' && `Proof submitted! Waiting for ${opponent?.name || 'partner'} to verify.`}
                </span>
              </div>
              {existingSubmission.feedback && (
                <div className="mt-2 text-xs italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  "{existingSubmission.feedback}"
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300 font-medium">
              {error}
            </div>
          )}

          {/* Photo Preview or Current Submission Photo */}
          {(imagePreview || existingSubmission?.photoUrl) && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {imagePreview ? 'Photo Evidence (Ready to Submit)' : 'Your Current Submission'}
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-64 border border-slate-700 flex items-center justify-center">
                <img
                  src={imagePreview || existingSubmission?.photoUrl}
                  alt="Proof preview"
                  className="w-full h-full object-contain"
                />
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImage(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-slate-200 hover:text-white backdrop-blur border border-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* If already approved, show locked status */}
          {existingSubmission?.status === 'approved' ? (
            <div className="text-center py-2 text-xs text-slate-400 font-medium">
              ✨ Challenge already completed and points awarded!
            </div>
          ) : (
            <>
              {/* Camera & Gallery Action Buttons */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Camera className="w-4 h-4" /> Open Camera
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 shadow-lg transition"
                >
                  <ImageIcon className="w-4 h-4" /> Pick Photo
                </button>
              </div>

              {/* Swap Item Option */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleSwapThisPrompt}
                  disabled={isSwapping}
                  className="text-xs text-slate-400 hover:text-amber-400 font-medium inline-flex items-center gap-1 transition p-1"
                >
                  <span>🔄 Don't like this challenge? Swap for a fresh one</span>
                </button>
              </div>

              {/* Caption / Defense Note Input */}
              {imagePreview && (
                <div className="space-y-1.5 pt-2 animate-in fade-in duration-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Defend Your Find (Optional Caption)
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Look at this madness! No way this is normal."
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              )}

              {/* Submit Proof Button */}
              {imagePreview && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Uploading & Sending to Partner...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Proof to {opponent?.name || 'Partner'}!
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
