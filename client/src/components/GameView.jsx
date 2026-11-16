import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, Clock, AlertCircle, Camera, Sparkles, Plus, 
  Volume2, VolumeX, Eye, ArrowRight, ShieldCheck, Flame, Bell, MessageSquare,
  RefreshCw, Shuffle, MoreVertical, Flag, RotateCcw, Home, X, Menu, Heart, Users,
  Zap, Grid, List, Lock, HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/audio';

const QUICK_REACTIONS = ['🏎️', '👀', '😂', '💀', '🔥', '📸', '🏆', '😱'];

const POWERUP_DETAILS = {
  freeze: { name: 'Aisle Freeze', icon: '🧊', desc: 'Frosted screen! Partner must wait 20s or shiver!' },
  opposite_hand: { name: 'Wrong Hand Only', icon: '🖐️', desc: 'Partner must snap next photo with non-dominant hand!' },
  slow_mo: { name: 'Slow-Motion Walk', icon: '🐢', desc: 'Partner must walk in dramatic slow motion for 30s!' }
};

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
  onLeaveToMainMenu,
  onTriggerLightning,
  onUsePowerup,
  onClaimBingo
}) {
  const [filter, setFilter] = useState('all');
  const [showLogDrawer, setShowLogDrawer] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showPowerupDrawer, setShowPowerupDrawer] = useState(false);
  const [revealedHints, setRevealedHints] = useState({});
  const [now, setNow] = useState(Date.now());
  const [muted, setMuted] = useState(false);
  const [swappingId, setSwappingId] = useState(null);

  // Clock tick for countdown timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => {
    sounds.muted = !muted;
    setMuted(!muted);
  };

  const isBingo = room?.gameMode === 'bingo';
  const isCoop = room?.gameMode === 'coop';
  const prompts = room?.prompts || [];
  const targetWins = room?.targetWins || 8;
  const teamScore = room?.teamScore || 0;
  const teamVerifiedCount = room?.teamVerifiedCount || 0;
  const mySubmissions = player?.submissions || {};
  const oppSubmissions = opponent?.submissions || {};

  // Active Sabotage on ME
  const myActiveSabotage = room?.activeSabotages?.[player?.id];
  const isSabotaged = myActiveSabotage && now < myActiveSabotage.endsAt;
  const sabotageSecondsLeft = isSabotaged ? Math.ceil((myActiveSabotage.endsAt - now) / 1000) : 0;

  // Active Lightning Frenzy
  const isLightningActive = room?.lightningFrenzy && now < room.lightningFrenzy.endsAt;
  const lightningSecondsLeft = isLightningActive ? Math.ceil((room.lightningFrenzy.endsAt - now) / 1000) : 0;

  // Extract my pending approval queue
  const pendingQueue = Object.entries(mySubmissions)
    .filter(([_, sub]) => sub.status === 'pending')
    .map(([promptId, sub]) => {
      const prompt = prompts.find((p) => p.id === promptId);
      return { promptId, prompt, ...sub };
    });

  // Filter prompts for List View
  const filteredPrompts = prompts.filter((p) => {
    const mySub = mySubmissions[p.id];
    const oppSub = oppSubmissions[p.id];
    const isTeamFound = mySub?.status === 'approved' || oppSub?.status === 'approved';

    if (filter === 'todo') {
      if (isCoop) return !isTeamFound;
      return !mySub || mySub.status === 'rejected';
    }
    if (filter === 'completed') {
      if (isCoop) return isTeamFound;
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

  const toggleRiddleHint = (e, promptId) => {
    e.stopPropagation();
    sounds.playDing();
    setRevealedHints(prev => ({ ...prev, [promptId]: !prev[promptId] }));
  };

  // 3x3 Bingo Calculations
  const bingoPrompts = prompts.slice(0, 9);
  const BINGO_LINES = [
    { name: 'Row 1', indices: [0, 1, 2] },
    { name: 'Row 2', indices: [3, 4, 5] },
    { name: 'Row 3', indices: [6, 7, 8] },
    { name: 'Col 1', indices: [0, 3, 6] },
    { name: 'Col 2', indices: [1, 4, 7] },
    { name: 'Col 3', indices: [2, 5, 8] },
    { name: 'Diagonal ↘', indices: [0, 4, 8] },
    { name: 'Diagonal ↗', indices: [2, 4, 6] }
  ];

  const countLinesForSubs = (subs) => {
    const isApproved = (idx) => {
      const p = bingoPrompts[idx];
      return p && subs[p.id]?.status === 'approved';
    };
    return BINGO_LINES.filter((line) => line.indices.every(isApproved)).length;
  };

  const myBingoLines = countLinesForSubs(mySubmissions);
  const oppBingoLines = countLinesForSubs(oppSubmissions);

  return (
    <div className={`max-w-md mx-auto p-2.5 sm:p-3 pb-24 space-y-2.5 ${isSabotaged && myActiveSabotage.id === 'freeze' ? 'border-4 border-cyan-400 rounded-3xl shadow-[0_0_25px_rgba(34,211,238,0.5)]' : ''}`}>
      {/* Top Bar with Options Menu */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 text-[11px]">
            {room.roomCode}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
            <span>{room.themeIcon || '🎯'}</span>
            <span className="truncate max-w-[95px]">{room.themeShortName || 'Hunt'}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium text-[11px]">
            {isBingo
              ? (room.targetWins === 9 ? 'Goal: Blackout' : `Goal: ${room.targetWins} Line(s)`)
              : isCoop
              ? `${teamVerifiedCount}/${targetWins}`
              : `Goal: ${targetWins}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMute}
            className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => setShowLogDrawer(true)}
            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 text-[11px]"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setShowMenuModal(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1 shadow transition"
          >
            <Menu className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>MENU</span>
          </button>
        </div>
      </div>

      {/* Active Sabotage Overlay Alert on Me */}
      {isSabotaged && (
        <div className="bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 p-2.5 rounded-xl shadow-lg flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin">{myActiveSabotage.icon}</span>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-cyan-300">
                SABOTAGED BY {myActiveSabotage.senderName}!
              </div>
              <div className="text-xs font-bold">{myActiveSabotage.name}: {myActiveSabotage.description}</div>
            </div>
          </div>
          <span className="text-xs font-mono font-black bg-cyan-900 border border-cyan-400 px-2 py-1 rounded-lg text-cyan-200 shrink-0">
            {sabotageSecondsLeft}s
          </span>
        </div>
      )}

      {/* Lightning Frenzy Active Banner */}
      {isLightningActive && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 p-2.5 rounded-xl border-2 border-yellow-300 shadow-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl animate-bounce">⚡</span>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <span>FLASH QUEST ({Math.floor(lightningSecondsLeft / 60)}:{(lightningSecondsLeft % 60).toString().padStart(2, '0')})</span>
                <span className="bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded text-[9px] font-black">{room.lightningFrenzy.multiplier}X PTS</span>
              </div>
              <div className="text-xs font-black truncate">{room.lightningFrenzy.title}</div>
            </div>
          </div>
          <button
            onClick={() => onOpenSnapModal({
              id: 'lightning-frenzy',
              title: room.lightningFrenzy.title,
              icon: room.lightningFrenzy.icon || '⚡',
              category: 'Lightning Frenzy',
              points: Math.round(150 * (room.lightningFrenzy.multiplier || 2)),
              description: `Snap proof of: ${room.lightningFrenzy.title}!`,
              hint: room.lightningFrenzy.hint,
              isLightning: true
            })}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs shrink-0 shadow active:scale-95 transition"
          >
            Snap It!
          </button>
        </div>
      )}

      {/* Road Trip Safety Banner */}
      {room.themeId === 'roadtrip' && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-xs shadow-md">
          <span className="text-base">🚗</span>
          <span className="font-medium text-[11px] leading-tight">
            <b className="text-cyan-300">Co-Pilot Safety:</b> Passenger navigates & snaps challenges while driver keeps eyes on the road!
          </span>
        </div>
      )}

      {/* Scoreboard: Bingo Mode vs Co-Op vs Head-to-Head */}
      {isBingo ? (
        /* Dedicated 3x3 Bingo Challenge Scoreboard */
        <div className="bg-slate-800/90 backdrop-blur rounded-2xl border border-purple-500/40 p-3 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🎯</span>
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  3x3 Bingo Card Faceoff
                </span>
                <div className="font-extrabold text-white text-xs">
                  {room.targetWins === 9 ? 'Full 9-Square Blackout Race!' : `First to Complete ${room.targetWins} Line(s)!`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-amber-400">
                {myApprovedCount}/9 Marked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/70 border border-blue-500/40 rounded-xl p-2 space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-blue-300">You ({player.name})</span>
              <div className="text-lg font-black text-amber-400">
                {myBingoLines} <span className="text-[10px] text-slate-400 font-normal">lines</span>
              </div>
              <div className="text-[10px] font-semibold text-blue-400">
                {myApprovedCount}/9 squares found
              </div>
            </div>

            <div className="bg-slate-900/70 border border-pink-500/40 rounded-xl p-2 space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-pink-300">Partner ({opponent?.name || 'Partner'})</span>
              <div className="text-lg font-black text-amber-400">
                {oppBingoLines} <span className="text-[10px] text-slate-400 font-normal">lines</span>
              </div>
              <div className="text-[10px] font-semibold text-pink-400">
                {oppApprovedCount}/9 squares found
              </div>
            </div>
          </div>
        </div>
      ) : isCoop ? (
        /* Couples Team Effort Scoreboard */
        <div className="bg-slate-800/90 backdrop-blur rounded-2xl border border-emerald-500/40 p-3 sm:p-3.5 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{player.avatar}</span>
              <span className="text-[10px] font-black text-pink-400">❤️</span>
              <span className="text-xl">{opponent?.avatar || '🐼'}</span>
              <div className="ml-1 min-w-0">
                <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Couple Team Effort
                </span>
                <div className="font-extrabold text-white text-xs truncate">
                  {player.name} & {opponent?.name || 'Partner'}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl font-black text-amber-400 leading-none">
                {teamScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-[10px] font-bold text-emerald-400 mt-0.5">
                {teamVerifiedCount} / {targetWins} Goal
              </div>
            </div>
          </div>

          {/* Unified Team Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
              <span>Team Progress</span>
              <span className="text-emerald-400 font-extrabold">
                {Math.min(100, Math.round((teamVerifiedCount / targetWins) * 100))}%
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-700/60 p-0.5 flex">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, (teamVerifiedCount / targetWins) * 100)}%` }}
              />
            </div>
          </div>

          {/* Contributions Breakdown */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-center text-[11px]">
            <div className="bg-slate-900/60 rounded-lg py-1 px-1.5 border border-slate-700/40 truncate">
              <span className="text-slate-400 font-medium">{player.name}: </span>
              <b className="text-blue-400">{myApprovedCount} found</b>
            </div>
            <div className="bg-slate-900/60 rounded-lg py-1 px-1.5 border border-slate-700/40 truncate">
              <span className="text-slate-400 font-medium">{opponent?.name || 'Partner'}: </span>
              <b className="text-pink-400">{oppApprovedCount} found</b>
            </div>
          </div>
        </div>
      ) : (
        /* Head-to-Head Couples Scoreboard */
        <div className="bg-slate-800/90 backdrop-blur rounded-2xl border border-slate-700/80 p-2.5 sm:p-3 shadow-lg space-y-2 relative overflow-hidden">
          <div className="grid grid-cols-2 gap-2 items-center">
            {/* Player (You) */}
            <div className="bg-slate-900/70 border border-blue-500/40 rounded-xl p-2 text-center space-y-0.5 relative">
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30">
                You
              </span>
              <div className="text-xl pt-0.5">{player.avatar}</div>
              <div className="font-bold text-white text-xs truncate">{player.name}</div>
              <div className="text-xl font-black text-amber-400 leading-none">
                {player.score} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-[10px] font-bold text-blue-400">
                {myApprovedCount} / {targetWins} to win
              </div>
            </div>

            {/* Opponent (Partner) */}
            <div className="bg-slate-900/70 border border-pink-500/40 rounded-xl p-2 text-center space-y-0.5 relative">
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30">
                Partner
              </span>
              <div className="text-xl pt-0.5">{opponent?.avatar || '🐼'}</div>
              <div className="font-bold text-white text-xs truncate">{opponent?.name || 'Partner'}</div>
              <div className="text-xl font-black text-amber-400 leading-none">
                {opponent?.score || 0} <span className="text-[10px] text-slate-400 font-normal">pts</span>
              </div>
              <div className="text-[10px] font-bold text-pink-400">
                {oppApprovedCount} / {targetWins} to win
              </div>
            </div>
          </div>

          {/* Progress Bar Race towards targetWins */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
              <span>Race to Goal</span>
              <span>First to {targetWins} Verified</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-700/60 p-0.5">
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

          {/* Sabotage Cards Button (Versus Mode Only) */}
          <button
            onClick={() => setShowPowerupDrawer(true)}
            className="w-full py-1.5 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-between transition active:scale-98"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">🃏</span>
              <span>Play Sabotage Card</span>
            </div>
            <span className="bg-purple-600/60 px-2 py-0.5 rounded-full text-[10px] text-purple-200">
              {player.powerups?.length || 0} Ready
            </span>
          </button>
        </div>
      )}

      {/* Awaiting Partner Approval Queue Section */}
      {pendingQueue.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-2.5 space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-300 tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Awaiting Approval ({pendingQueue.length})</span>
            </div>
            <span className="text-[10px] text-amber-400 font-medium bg-amber-400/20 px-1.5 py-0.5 rounded-full">
              Sent to {opponent?.name || 'Partner'}
            </span>
          </div>

          <div className="space-y-1.5">
            {pendingQueue.map((item) => (
              <div
                key={item.promptId}
                onClick={() => item.prompt && onOpenSnapModal(item.prompt)}
                className="bg-slate-900/80 border border-amber-400/30 rounded-lg p-2 flex items-center justify-between gap-2.5 cursor-pointer hover:border-amber-400/60 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt="submission"
                      className="w-9 h-9 rounded-md object-cover bg-black border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-slate-800 flex items-center justify-center text-lg shrink-0">
                      {item.promptIcon || '📸'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {item.promptTitle || item.prompt?.title}
                    </div>
                    <div className="text-[10px] text-amber-300/90 truncate flex items-center gap-1">
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
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-2.5 rounded-xl shadow-lg border border-yellow-300 flex items-center justify-between cursor-pointer active:scale-98 transition animate-attention"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📸</span>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-slate-900">
                Action Required!
              </div>
              <div className="text-xs font-black leading-tight">
                {pendingVerificationRequest.playerName} found "{pendingVerificationRequest.promptTitle}"!
              </div>
              <div className="text-[10px] font-semibold text-slate-800">
                Tap to inspect photo and verify!
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Real-time Emoji Reactions Bar */}
      <div className="flex items-center justify-between gap-1 p-1.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Taunt:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="text-base p-1 hover:bg-slate-700/80 active:scale-125 rounded-lg transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* DEDICATED 3x3 BINGO BOARD OR REGULAR CARD LIST */}
      {isBingo ? (
        /* Dedicated 3x3 Bingo Grid View */
        <div className="bg-slate-800/90 border-2 border-purple-500/50 rounded-2xl p-3 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-purple-300">
            <div className="flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-purple-400" />
              <span>3x3 BINGO CHALLENGE BOARD</span>
            </div>
            <span className="text-[10px] text-purple-200/80 font-normal">
              {room.targetWins === 9 ? 'Blackout: All 9 squares' : `Goal: Complete ${room.targetWins} Line(s)!`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {bingoPrompts.map((prompt, idx) => {
              const mySub = mySubmissions[prompt.id];
              const oppSub = oppSubmissions[prompt.id];
              const isMyDone = mySub?.status === 'approved';
              const isOppDone = oppSub?.status === 'approved';

              return (
                <div
                  key={prompt.id}
                  onClick={() => onOpenSnapModal(prompt)}
                  className={`aspect-square p-2 rounded-xl border flex flex-col items-center justify-between text-center cursor-pointer active:scale-95 transition relative overflow-hidden ${
                    isMyDone
                      ? 'bg-blue-950/80 border-blue-400 shadow-md ring-1 ring-blue-400'
                      : isOppDone
                      ? 'bg-pink-950/70 border-pink-500/70'
                      : mySub?.status === 'pending'
                      ? 'bg-amber-950/70 border-amber-400/80'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="text-2xl pt-0.5">{prompt.icon}</span>
                  <span className="text-[10px] font-bold line-clamp-2 leading-tight text-white px-0.5">
                    {prompt.title}
                  </span>
                  <div className="w-full flex items-center justify-between text-[9px] font-black pt-1 border-t border-slate-700/50">
                    <span className="text-amber-400">+{prompt.points}</span>
                    {isMyDone ? (
                      <span className="text-blue-300 flex items-center gap-0.5 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" /> You
                      </span>
                    ) : isOppDone ? (
                      <span className="text-pink-300 flex items-center gap-0.5 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-pink-400" /> {opponent?.name ? opponent.name.slice(0, 4) : 'Part'}
                      </span>
                    ) : (
                      <span className="text-slate-500">#{idx + 1}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Regular Hunt Card List */
        <>
          {/* Filter Tabs & Custom Challenge Button */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex gap-1 p-0.5 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({prompts.length})
              </button>
              <button
                onClick={() => setFilter('todo')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  filter === 'todo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isCoop ? `Need (${prompts.length - teamVerifiedCount})` : `To Hunt (${prompts.length - myApprovedCount})`}
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-0.5 rounded-md transition ${
                  filter === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isCoop ? `Team (${teamVerifiedCount})` : `Found (${myApprovedCount})`}
              </button>
            </div>

            <button
              onClick={onOpenAddPrompt}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-[11px] font-bold transition active:scale-95"
            >
              <Plus className="w-3 h-3" /> Custom
            </button>
          </div>

          {/* Hunt Items List */}
          <div className="space-y-2">
            {filteredPrompts.map((prompt) => {
              const mySub = mySubmissions[prompt.id];
              const oppSub = oppSubmissions[prompt.id];
              const isTeamApproved = isCoop && (mySub?.status === 'approved' || oppSub?.status === 'approved');
              const isMyApproved = mySub?.status === 'approved';
              const isCompleted = isCoop ? isTeamApproved : isMyApproved;

              return (
                <div
                  key={prompt.id}
                  onClick={() => onOpenSnapModal(prompt)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer active:scale-98 shadow-sm relative overflow-hidden group ${
                    isCompleted
                      ? 'bg-slate-800/50 border-emerald-500/40 hover:border-emerald-500/70'
                      : mySub?.status === 'pending' || oppSub?.status === 'pending'
                      ? 'bg-slate-800/70 border-amber-500/50 hover:border-amber-500'
                      : mySub?.status === 'rejected'
                      ? 'bg-slate-800/70 border-rose-500/50 hover:border-rose-500'
                      : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {/* Category & Points Top & Swap Button */}
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400 uppercase tracking-wider">
                        {prompt.category}
                      </span>
                      {prompt.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-300 font-medium">
                          {prompt.badge}
                        </span>
                      )}
                      {prompt.isRiddle && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          📜 Riddle
                        </span>
                      )}
                      {prompt.isSecretGift && (
                        <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                          🤫 Secret &lt;$5
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-amber-400">
                        +{prompt.points} PTS
                      </span>

                      {!isCompleted && (
                        <button
                          onClick={(e) => handleSwapClick(e, prompt.id)}
                          disabled={swappingId === prompt.id}
                          title="Don't like this item? Swap it!"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-300 hover:text-white transition active:scale-95 text-[9px] font-bold"
                        >
                          <Shuffle className={`w-2.5 h-2.5 ${swappingId === prompt.id ? 'animate-spin' : ''}`} />
                          <span>Swap</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-2.5">
                    <div className="text-2xl p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 shrink-0">
                      {prompt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm leading-snug">
                        {prompt.title}
                      </h4>
                      {prompt.isRiddle ? (
                        <p className="font-serif italic text-amber-200 text-xs mt-1 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-amber-500/20 whitespace-pre-line">
                          "{prompt.riddleClue}"
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5 leading-snug">
                          {prompt.description}
                        </p>
                      )}

                      {/* Riddle Hint Toggle */}
                      {prompt.isRiddle && prompt.riddleHint && (
                        <div className="mt-1">
                          {revealedHints[prompt.id] ? (
                            <span className="text-[10px] text-amber-300 font-medium bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-block">
                              💡 <b>Hint:</b> {prompt.riddleHint}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => toggleRiddleHint(e, prompt.id)}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline"
                            >
                              💡 Reveal Clue Hint
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    {isCoop ? (
                      /* Co-Op Team Status */
                      <div className="w-full flex items-center justify-between">
                        <div>
                          {mySub?.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Found by You (+{mySub.pointsEarned} team pts)
                            </span>
                          ) : oppSub?.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Found by {opponent?.name || 'Partner'} (+{oppSub.pointsEarned} team pts)
                            </span>
                          ) : mySub?.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> In Approval Queue...
                            </span>
                          ) : oppSub?.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                              <Eye className="w-3.5 h-3.5" /> Partner submitted! Tap to verify!
                            </span>
                          ) : mySub?.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                              <AlertCircle className="w-3.5 h-3.5" /> Rejected! Tap to retake
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
                              <Camera className="w-3.5 h-3.5" /> Tap to Hunt & Snap for Team
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          🤝 Team
                        </div>
                      </div>
                    ) : (
                      /* Versus Mode Status */
                      <>
                        <div>
                          {mySub?.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified (+{mySub.pointsEarned} pts)
                            </span>
                          )}
                          {mySub?.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> In Approval Queue...
                            </span>
                          )}
                          {mySub?.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                              <AlertCircle className="w-3.5 h-3.5" /> Rejected! Tap to retake
                            </span>
                          )}
                          {!mySub && (
                            <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
                              <Camera className="w-3.5 h-3.5" /> Tap to Hunt & Snap
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <span>{opponent?.avatar || 'Partner'}:</span>
                          {oppSub?.status === 'approved' ? (
                            <span className="text-emerald-400 font-bold">Verified</span>
                          ) : oppSub?.status === 'pending' ? (
                            <span className="text-amber-400 font-bold">Pending Review</span>
                          ) : (
                            <span className="text-slate-500">Searching...</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Sabotage Power-Ups Drawer (Versus Mode) */}
      {showPowerupDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl max-w-sm w-full p-4 space-y-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🃏</span>
                <h3 className="font-bold text-white text-sm">Playful Sabotage Cards</h3>
              </div>
              <button onClick={() => setShowPowerupDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Pick a playful handicap to spring on <b>{opponent?.name || 'Partner'}</b>!
            </p>

            <div className="space-y-2">
              {(player.powerups || []).length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                  No sabotage cards remaining! Verify more finds to reload.
                </div>
              ) : (
                (player.powerups || []).map((powerupId, idx) => {
                  const card = POWERUP_DETAILS[powerupId] || { name: powerupId, icon: '🃏', desc: 'Sabotage effect' };
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-purple-500/30 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl">{card.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">{card.name}</div>
                          <div className="text-[10px] text-purple-300 truncate">{card.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowPowerupDrawer(false);
                          onUsePowerup(opponent?.id, powerupId);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs shrink-0 shadow"
                      >
                        Play!
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Options Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Game Controls</h3>
                <div className="text-xs text-amber-300 font-medium flex items-center gap-1 mt-0.5">
                  <span>{room.themeIcon || '🎯'}</span>
                  <span>{room.themeName || 'Scavenger Hunt'}</span>
                </div>
              </div>
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
                  onTriggerLightning();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-2.5 transition text-left"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>⚡ Trigger Lightning Frenzy Flash Quest!</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  if (window.confirm('Are you sure you want to end the match early and view the results?')) {
                    onEndGameEarly();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center gap-2.5 transition text-left"
              >
                <Flag className="w-4 h-4 text-amber-400" />
                <span>End Match Early & See Results</span>
              </button>

              <button
                onClick={() => {
                  setShowMenuModal(false);
                  if (window.confirm('Reset all scores and start a fresh rematch with your partner?')) {
                    onRematch();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center gap-2.5 transition text-left"
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
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-2.5 transition text-left"
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
