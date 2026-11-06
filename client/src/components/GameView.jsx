import React, { useState } from 'react';
import { 
  Trophy, CheckCircle2, Clock, AlertCircle, Camera, Sparkles, Plus, 
  Volume2, VolumeX, Eye, ArrowRight, ShieldCheck, Flame, Bell, MessageSquare,
  RefreshCw, Shuffle, MoreVertical, Flag, RotateCcw, Home, X, Menu
} from 'lucide-react';
import { sounds } from '../utils/audio';

const QUICK_REACTIONS = ['🏎️', '👀', '😂', '💀', '🔥', '📸', '🏆', '😱'];

export default function GameView({
  room,
  player,
  opponent,
  onOpenSnapModal,
  onOpenVerification,
  pendingVerificationRequest,
  onSendReaction,
  onOpenAddPrompt,
  onSwapPrompt,
  onEndGameEarly,
  onRematch,
  onLeaveToMainMenu
}) {
  const [filter, setFilter] = useState('all');
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [swappingId, setSwappingId] = useState(null);

  const toggleMute = () => {
    sounds.muted = !muted;
    setMuted(!muted);
  };

  const prompts = room?.prompts || [];
  const targetWins = room?.targetWins || 8;
  const mySubmissions = player?.submissions || {};
  const oppSubmissions = opponent?.submissions || {};

  // Extract my pending approval queue
  const pendingQueue = Object.entries(mySubmissions)
    .filter(([_, sub]) => sub.status === 'pending')
    .map(([promptId, sub]) => {
      const prompt = prompts.find((p) => p.id === promptId);
      return { promptId, prompt, ...sub };
    });

  // Filter prompts
  const filteredPrompts = prompts.filter((p) => {
    const mySub = mySubmissions[p.id];
    if (filter === 'todo') {
      return !mySub || mySub.status === 'rejected';
    }
    if (filter === 'completed') {
      return mySub?.status === 'approved';
    }
    return true;
  });

  const myApprovedCount = Object.values(mySubmissions).filter((s) => s.status === 'approved').length;
  const oppApprovedCount = Object.values(oppSubmissions).filter((s) => s.status === 'approved').length;

  const handleSwapClick = (e, promptId) => {
    e.stopPropagation();
    if (swappingId) return;

    if (window.confirm("Don't like this item? Swap it for a fresh one from the deck?")) {
      setSwappingId(promptId);
      sounds.playDing();
      onSwapPrompt(promptId, () => {
        setSwappingId(null);
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-3 sm:p-4 pb-24 space-y-4">
      {/* Top Bar with Options Menu */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
            ROOM: {room.roomCode}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">Race to {targetWins}!</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => setShowLogDrawer(true)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 text-[11px]"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setShowMenuModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition"
          >
            <Menu className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>MENU</span>
          </button>
        </div>
      </div>

      {/* Head-to-Head Couples Scoreboard */}
      <div className="bg-slate-800/90 backdrop-blur rounded-3xl border border-slate-700/80 p-4 shadow-xl space-y-3 relative overflow-hidden">
        <div className="grid grid-cols-2 gap-3 items-center">
          {/* Player (You) */}
          <div className="bg-slate-900/70 border border-blue-500/40 rounded-2xl p-3 text-center space-y-1 relative">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30">
              You
            </span>
            <div className="text-2xl pt-0.5">{player.avatar}</div>
            <div className="font-bold text-white text-sm truncate">{player.name}</div>
            <div className="text-2xl font-black text-amber-400">
              {player.score} <span className="text-[11px] text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-[11px] font-bold text-blue-400">
              {myApprovedCount} / {targetWins} to win
            </div>
          </div>

          {/* Opponent (Partner) */}
          <div className="bg-slate-900/70 border border-pink-500/40 rounded-2xl p-3 text-center space-y-1 relative">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30">
              Partner
            </span>
            <div className="text-2xl pt-0.5">{opponent?.avatar || '🐼'}</div>
            <div className="font-bold text-white text-sm truncate">{opponent?.name || 'Partner'}</div>
            <div className="text-2xl font-black text-amber-400">
              {opponent?.score || 0} <span className="text-[11px] text-slate-400 font-normal">pts</span>
            </div>
            <div className="text-[11px] font-bold text-pink-400">
              {oppApprovedCount} / {targetWins} to win
            </div>
          </div>
        </div>

        {/* Progress Bar Race towards targetWins */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
            <span>Race to Goal</span>
            <span>First to {targetWins} Verified</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-700/60 p-0.5">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (myApprovedCount / targetWins) * 100) / 2}%` }}
            />
            <div className="w-1" />
            <div
              className="bg-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (oppApprovedCount / targetWins) * 100) / 2}%` }}
            />
          </div>
        </div>
      </div>

      {/* Awaiting Partner Approval Queue Section */}
      {pendingQueue.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-3.5 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300 tracking-wider">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Awaiting Approval Queue ({pendingQueue.length})</span>
            </div>
            <span className="text-[10px] text-amber-400 font-medium bg-amber-400/20 px-2 py-0.5 rounded-full">
              Sent to {opponent?.name || 'Partner'}
            </span>
          </div>

          <div className="space-y-2">
            {pendingQueue.map((item) => (
              <div
                key={item.promptId}
                onClick={() => item.prompt && onOpenSnapModal(item.prompt)}
                className="bg-slate-900/80 border border-amber-400/30 rounded-xl p-2.5 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400/60 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt="submission"
                      className="w-11 h-11 rounded-lg object-cover bg-black border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-xl shrink-0">
                      {item.promptIcon || '📸'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {item.promptTitle || item.prompt?.title}
                    </div>
                    <div className="text-[11px] text-amber-300/90 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                      <span>Waiting for {opponent?.name || 'Partner'} to approve...</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-400">
                    +{item.prompt?.points || 100} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Partner Verification Alert Banner */}
      {pendingVerificationRequest && (
        <div
          onClick={() => onOpenVerification(pendingVerificationRequest)}
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-4 rounded-2xl shadow-xl border-2 border-yellow-300 flex items-center justify-between cursor-pointer active:scale-98 transition animate-attention"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📸</span>
            <div>
              <div className="text-[11px] uppercase font-black tracking-wider text-slate-900">
                Action Required!
              </div>
              <div className="text-sm font-black leading-tight">
                {pendingVerificationRequest.playerName} found "{pendingVerificationRequest.promptTitle}"!
              </div>
              <div className="text-xs font-semibold text-slate-800">
                Tap to inspect photo and verify!
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Real-time Emoji Reactions Bar */}
      <div className="flex items-center justify-between gap-1 p-2 bg-slate-800/60 rounded-2xl border border-slate-700/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Taunt:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="text-lg p-1.5 hover:bg-slate-700/80 active:scale-125 rounded-xl transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Swap Hint */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deck ({prompts.length})
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'todo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            To Hunt ({prompts.length - myApprovedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Found ({myApprovedCount})
          </button>
        </div>

        <button
          onClick={onOpenAddPrompt}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" /> Custom
        </button>
      </div>

      {/* Hunt Items List */}
      <div className="space-y-3">
        {filteredPrompts.map((prompt) => {
          const mySub = mySubmissions[prompt.id];
          const oppSub = oppSubmissions[prompt.id];
          const isApproved = mySub?.status === 'approved';

          return (
            <div
              key={prompt.id}
              onClick={() => onOpenSnapModal(prompt)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer active:scale-98 shadow-md relative overflow-hidden group ${
                mySub?.status === 'approved'
                  ? 'bg-slate-800/50 border-emerald-500/40 hover:border-emerald-500/70'
                  : mySub?.status === 'pending'
                  ? 'bg-slate-800/70 border-amber-500/50 hover:border-amber-500'
                  : mySub?.status === 'rejected'
                  ? 'bg-slate-800/70 border-rose-500/50 hover:border-rose-500'
                  : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              {/* Category & Points Top & Swap Button */}
              <div className="flex items-center justify-between text-[11px] mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    {prompt.category}
                  </span>
                  {prompt.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 font-medium">
                      {prompt.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-400">
                    +{prompt.points} PTS
                  </span>

                  {!isApproved && (
                    <button
                      onClick={(e) => handleSwapClick(e, prompt.id)}
                      disabled={swappingId === prompt.id}
                      title="Don't like this item? Swap it!"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/70 hover:bg-slate-600 text-slate-300 hover:text-white transition active:scale-95 text-[10px] font-bold"
                    >
                      <Shuffle className={`w-3 h-3 ${swappingId === prompt.id ? 'animate-spin' : ''}`} />
                      <span>Swap</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3">
                <div className="text-3xl p-2 rounded-xl bg-slate-900/80 border border-slate-700 shrink-0">
                  {prompt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-white text-base leading-tight">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                    {prompt.description}
                  </p>
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  {mySub?.status === 'approved' && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Verified (+{mySub.pointsEarned} pts)
                    </span>
                  )}
                  {mySub?.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 text-amber-400 font-bold animate-pulse">
                      <Clock className="w-4 h-4" /> In Approval Queue...
                    </span>
                  )}
                  {mySub?.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 text-rose-400 font-bold">
                      <AlertCircle className="w-4 h-4" /> Rejected! Tap to retake
                    </span>
                  )}
                  {!mySub && (
                    <span className="inline-flex items-center gap-1.5 text-blue-400 font-bold">
                      <Camera className="w-4 h-4" /> Tap to Hunt & Snap
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>{opponent?.avatar || 'Partner'}:</span>
                  {oppSub?.status === 'approved' ? (
                    <span className="text-emerald-400 font-bold">Found ✅</span>
                  ) : oppSub?.status === 'pending' ? (
                    <span className="text-amber-400 font-bold">Inspecting...</span>
                  ) : (
                    <span className="text-slate-500">Searching...</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Game Controls Bar */}
      <div className="pt-3 pb-6">
        <button
          onClick={() => setShowMenuModal(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
        >
          <Menu className="w-4 h-4 text-amber-400" />
          <span>Game Options (End Match • Rematch • Main Menu)</span>
        </button>
      </div>

      {/* Game Options Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Game Controls</h3>
              <button
                onClick={() => setShowMenuModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <button
                onClick={() => {
                  setShowMenuModal(false);
                  if (window.confirm('Are you sure you want to end the match early and view the results?')) {
                    onEndGameEarly();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-2.5 transition text-left"
              >
                <Flag className="w-4 h-4 text-amber-400" />
                <span>End Match Early & See Winner</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  if (window.confirm('Reset all scores and start a fresh rematch with your partner?')) {
                    onRematch();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center gap-2.5 transition text-left"
              >
                <RotateCcw className="w-4 h-4 text-blue-400" />
                <span>Rematch / Reset Scores</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  if (window.confirm('Leave this room and return to the main lobby screen?')) {
                    onLeaveToMainMenu();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-2.5 transition text-left"
              >
                <Home className="w-4 h-4 text-rose-400" />
                <span>Leave to Main Menu / New Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Drawer */}
      {showLogDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-700 w-full max-w-sm h-full p-4 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Match Activity Feed</h3>
              </div>
              <button
                onClick={() => setShowLogDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {[...(room.activityLog || [])].reverse().map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs space-y-1"
                >
                  <div className="text-slate-200 font-medium leading-relaxed">
                    {log.message}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
