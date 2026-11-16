import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, Play, Users, Sparkles, ArrowRight, ArrowLeft, RefreshCw, ShoppingCart, Heart, Globe, Home, Compass } from 'lucide-react';
import socket from '../utils/socket';
import { sounds } from '../utils/audio';
import { THEME_LIST, getThemeById } from '../utils/themes';

const AVATARS = ['🦊', '🐼', '🐯', '🐰', '🐶', '🦄', '🐱', '🐻', '🐨', '🦁', '🐸', '🐧'];

export default function Lobby({ room, player, onJoinSuccess, onLeaveRoom }) {
  const [mode, setMode] = useState('create');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [joinCode, setJoinCode] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('supermarket');
  const [gameMode, setGameMode] = useState('coop'); // 'coop' or 'versus'
  const [boardFormat, setBoardFormat] = useState('standard'); // 'standard' or 'bingo'
  const [targetWins, setTargetWins] = useState(8); // Target items to find (or lines for bingo)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [joinUrl, setJoinUrl] = useState('');
  const [publicTunnelUrl, setPublicTunnelUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [themeCounts, setThemeCounts] = useState({});

  // Fetch dynamic theme counts from server API
  useEffect(() => {
    fetch('/api/themes')
      .then((res) => res.json())
      .then((data) => {
        if (data?.themes) {
          const map = {};
          data.themes.forEach((t) => {
            map[t.id] = t.promptCount;
          });
          setThemeCounts(map);
        }
      })
      .catch(() => {});
  }, []);

  // Check URL query param for room code
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      if (roomParam) {
        setJoinCode(roomParam.toUpperCase());
        setMode('join');
      }
    }
  }, []);

  // Fetch QR Code and Network Info when room is created
  useEffect(() => {
    if (room?.roomCode) {
      fetch(`/api/room-qr/${room.roomCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.qrDataUrl) {
            setQrCodeData(data.qrDataUrl);
          }
          if (data.joinUrl) {
            setJoinUrl(data.joinUrl);
          }
          if (data.publicTunnelUrl) {
            setPublicTunnelUrl(data.publicTunnelUrl);
          }
        })
        .catch(() => {});
    }
  }, [room?.roomCode]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name / nickname!');
      return;
    }
    setError('');
    setLoading(true);
    sounds.playDing();

    const activeThemeObj = THEME_LIST.find((t) => t.id === selectedTheme);
    const effectiveGameMode = activeThemeObj?.coopOnly ? 'coop' : gameMode;

    socket.emit('create_room', {
      hostName: name.trim(),
      hostAvatar: selectedAvatar,
      targetWins: Number(targetWins),
      deckSize: 20, // 20 items per match
      gameMode: effectiveGameMode,
      themeId: selectedTheme,
      boardFormat: boardFormat,
      isBingo: boardFormat === 'bingo'
    }, (res) => {
      setLoading(false);
      if (res.success) {
        onJoinSuccess(res.room, res.playerId);
      } else {
        setError(res.error || 'Failed to create room');
      }
    });
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name / nickname!');
      return;
    }
    if (!joinCode.trim()) {
      setError('Please enter the 4-letter room code!');
      return;
    }
    setError('');
    setLoading(true);
    sounds.playDing();

    socket.emit('join_room', {
      roomCode: joinCode.trim().toUpperCase(),
      playerName: name.trim(),
      playerAvatar: selectedAvatar
    }, (res) => {
      setLoading(false);
      if (res.success) {
        onJoinSuccess(res.room, res.playerId);
      } else {
        setError(res.error || 'Failed to join room');
      }
    });
  };

  const handleStartGame = () => {
    if (!room || !player) return;
    sounds.playDing();
    socket.emit('start_game', {
      roomCode: room.roomCode,
      playerId: player.id
    }, (res) => {
      if (!res.success) {
        setError(res.error || 'Failed to start game');
      }
    });
  };

  const copyRoomCode = () => {
    if (!room?.roomCode) return;
    const shareUrl = joinUrl || `${window.location.origin}/?room=${room.roomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    sounds.playDing();
    setTimeout(() => setCopied(false), 2500);
  };

  // If in a room that is waiting for the partner or game start
  if (room && player) {
    const playersList = Object.values(room.players || {});
    const isHost = player.isHost;
    const opponent = playersList.find((p) => p.id !== player.id);
    const bothReady = playersList.length === 2;

    return (
      <div className="max-w-md mx-auto p-3 space-y-3.5">
        {/* Top Back Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Leave this room and return to main menu?')) {
                onLeaveRoom?.();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700/80 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Main Menu
          </button>
          <span className="text-xs text-amber-400 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
            Room: {room.roomCode}
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Couples Scavenger Hunt
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{room.themeIcon || '🎯'}</span>
            <span>{room.themeName || 'Hunt Lobby'}</span>
          </h1>
          <p className="text-xs text-amber-300 font-medium">
            {room.themeSubtitle || 'Find items & snap proof!'}
          </p>
          <p className="text-xs text-slate-400">
            {bothReady ? 'Both partners connected! Ready to hunt.' : 'Share the code or QR with your partner!'}
          </p>
        </div>

        {/* Global Access Badge */}
        {publicTunnelUrl && (
          <div className="inline-flex items-center justify-center gap-2 w-full py-1 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Online: Works on 5G/LTE & Wi-Fi!</span>
          </div>
        )}

        {/* Room Code Card */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-pink-500" />
          
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Game Room Code
          </div>
          <div className="text-4xl font-black tracking-widest text-amber-400 font-mono py-1 drop-shadow-md">
            {room.roomCode}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              onClick={copyRoomCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Copy Invite Link'}
            </button>

            {qrCodeData && (
              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-medium transition active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" /> Show QR
              </button>
            )}
          </div>
        </div>

        {/* QR Modal */}
        {showQrModal && qrCodeData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-white">Scan to Join Room</h3>
              <p className="text-xs text-slate-400">
                Have your partner open their phone camera and point it at this QR code:
              </p>
              <div className="bg-white p-3 rounded-2xl shadow-inner inline-block">
                <img src={qrCodeData} alt="Join QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <div className="font-mono text-2xl font-black text-amber-400 tracking-wider">
                {room.roomCode}
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Match Rules & Target Settings */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Match Mode:
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-lg font-black text-xs ${
                room.gameMode === 'coop'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {room.gameMode === 'coop' ? '🤝 Team Effort' : '⚔️ Head-to-Head'}
              </span>
              <span className={`px-2 py-0.5 rounded-lg font-black text-xs ${
                room.isBingo
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {room.isBingo ? '🎯 3x3 Bingo' : '📋 List Hunt'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>{room.gameMode === 'coop' ? 'Team Objective:' : 'Win Condition:'}</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-300 font-bold border border-blue-500/30">
              {room.isBingo
                ? (room.targetWins === 9
                    ? 'Full 9-Square Blackout!'
                    : `${room.gameMode === 'coop' ? 'Complete' : 'First to Complete'} ${room.targetWins} Line(s)!`)
                : room.gameMode === 'coop'
                ? `Find ${room.targetWins} Items Together!`
                : `First to ${room.targetWins} Verified Items!`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
            {room.isBingo && room.gameMode === 'coop'
              ? '🤝 Team Bingo: Work together on the 3x3 card! Both partners\' verified finds count towards completing rows, columns, or blackout!'
              : room.isBingo
              ? '🎯 Bingo Faceoff: Race against your partner on a 3x3 grid! First to complete the target lines or blackout wins!'
              : room.gameMode === 'coop'
              ? '🤝 Divide and conquer! When you snap an item, your partner verifies it to score points for your team!'
              : '⚔️ Racing against each other! When you snap an item, your partner verifies it to award you points!'}
          </p>
        </div>

        {/* Players Card */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between px-1">
            <span>Players (2 Max)</span>
            <span className="text-slate-500">{playersList.length}/2</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Player 1 */}
            <div className="bg-slate-800/90 border-2 border-blue-500/60 rounded-2xl p-4 text-center space-y-2 relative shadow-lg">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {player.isHost ? 'Host' : 'You'}
              </span>
              <div className="text-4xl py-1">{player.avatar}</div>
              <div className="font-bold text-white truncate text-base">{player.name}</div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
              </div>
            </div>

            {/* Player 2 */}
            {opponent ? (
              <div className="bg-slate-800/90 border-2 border-pink-500/60 rounded-2xl p-4 text-center space-y-2 relative shadow-lg">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  Partner
                </span>
                <div className="text-4xl py-1">{opponent.avatar}</div>
                <div className="font-bold text-white truncate text-base">{opponent.name}</div>
                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-2xl p-4 text-center space-y-2 flex flex-col items-center justify-center min-h-[135px]">
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 animate-pulse">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-400">Waiting for partner...</div>
                <div className="text-[10px] text-slate-500">Scan QR or enter code</div>
              </div>
            )}
          </div>
        </div>

        {/* Start Game Action */}
        {isHost ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={handleStartGame}
              disabled={!bothReady}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 transition active:scale-95 ${
                bothReady
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 animate-attention'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              {bothReady
                ? `START ${(room.themeShortName || 'HUNT').toUpperCase()}!`
                : 'WAITING FOR PARTNER TO JOIN...'}
            </button>
            {!bothReady && (
              <p className="text-center text-xs text-slate-500">
                You can start once your partner joins with code <b>{room.roomCode}</b>
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-slate-300 text-sm">
            <div className="animate-spin inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full mb-2" />
            <p className="font-semibold text-white">Connected! Waiting for host to press Start...</p>
          </div>
        )}
      </div>
    );
  }

  // Initial Form: Create or Join
  return (
    <div className="max-w-md mx-auto p-3 sm:p-4 space-y-3.5 pt-3">
      {/* Condensed Brand Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
          <Sparkles className="w-3 h-3" /> COUPLES DATE NIGHT
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          <span>Aisle Rivals</span> <span className="text-xl">🎯</span>
        </h1>
        <p className="text-xs text-slate-400">
          2-player scavenger hunt for couples • Snap, verify & win!
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-800/90 rounded-xl border border-slate-700">
        <button
          type="button"
          onClick={() => {
            setMode('create');
            setError('');
          }}
          className={`py-2 rounded-lg text-xs font-bold transition ${
            mode === 'create'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Create New Game
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('join');
            setError('');
          }}
          className={`py-2 rounded-lg text-xs font-bold transition ${
            mode === 'join'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Join Partner's Room
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-2.5 text-red-300 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {/* Player Setup Form */}
      <form onSubmit={mode === 'create' ? handleCreateRoom : handleJoinRoom} className="space-y-3">
        {/* Name input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Your Name / Nickname
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Honey Bear, Alex, Detective"
            maxLength={20}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
        </div>

        {/* Compact Avatar Picker */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Avatar
            </label>
            <span className="text-xs text-amber-300 font-bold">Selected: {selectedAvatar}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-800/70 rounded-xl border border-slate-700 no-scrollbar">
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  setSelectedAvatar(av);
                  sounds.playDing();
                }}
                className={`text-xl p-1.5 rounded-lg shrink-0 transition ${
                  selectedAvatar === av
                    ? 'bg-amber-400/30 border border-amber-400 scale-105 shadow'
                    : 'hover:bg-slate-700/60 border border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Room Code if Joining */}
        {mode === 'join' && (
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              4-Letter Room Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. WALM"
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-center font-mono font-black text-2xl tracking-widest placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>
        )}

        {/* Theme Selection if Creating */}
        {mode === 'create' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Hunt Theme / Category
              </label>
              <span className="text-[11px] font-bold text-amber-400">
                {THEME_LIST.find((t) => t.id === selectedTheme)?.shortName} ({themeCounts[selectedTheme] || THEME_LIST.find((t) => t.id === selectedTheme)?.itemCount} items)
              </span>
            </div>

            {/* Compact 2-column Category Chips */}
            <div className="grid grid-cols-2 gap-1.5">
              {THEME_LIST.map((th) => {
                const isSelected = selectedTheme === th.id;
                const count = themeCounts[th.id] || th.itemCount;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(th.id);
                      if (th.coopOnly) {
                        setGameMode('coop');
                      }
                      sounds.playDing();
                    }}
                    className={`p-2 rounded-xl border text-left transition relative active:scale-98 flex items-center justify-between gap-1.5 ${
                      isSelected
                        ? `${th.borderActive} shadow`
                        : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <span className="text-base shrink-0">{th.icon}</span>
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {th.shortName}
                      </span>
                    </div>

                    {/* Small number in top right */}
                    <span
                      className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-950/90 text-amber-300 border border-amber-400/30 shadow-sm shrink-0"
                      title={`${count} items`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Single Selected Theme Preview Card */}
            {(() => {
              const currentThemeObj = THEME_LIST.find((t) => t.id === selectedTheme);
              if (!currentThemeObj) return null;
              const count = themeCounts[currentThemeObj.id] || currentThemeObj.itemCount;
              return (
                <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs flex items-center gap-2 shadow-sm">
                  <span className="text-xl shrink-0">{currentThemeObj.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-bold text-white text-[11px] truncate">
                        {currentThemeObj.name}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${currentThemeObj.badgeStyle}`}>
                        {currentThemeObj.badge} • {count} items
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-300/90 truncate">
                      {currentThemeObj.subtitle}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {currentThemeObj.description}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Game Mode (Match Style) Selection if Creating */}
        {mode === 'create' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                1. Match Style
              </label>
              {THEME_LIST.find((t) => t.id === selectedTheme)?.coopOnly && (
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  🚗 Road Safety Locked
                </span>
              )}
            </div>

            {THEME_LIST.find((t) => t.id === selectedTheme)?.coopOnly ? (
              <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 shadow-sm">
                <span className="text-base shrink-0">🤝</span>
                <span className="text-[11px] text-slate-300 leading-tight">
                  <b className="text-cyan-300">Team Effort Only:</b> For driving safety, passenger spots & snaps while driver focuses on the road!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGameMode('coop');
                    sounds.playDing();
                  }}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    gameMode === 'coop'
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow ring-1 ring-emerald-400'
                      : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-lg">🤝</div>
                  <div className="font-bold text-xs text-emerald-400 leading-tight mt-0.5">Team Effort</div>
                  <div className="text-[10px] text-slate-300 leading-tight mt-0.5">Co-Op Partnership</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGameMode('versus');
                    sounds.playDing();
                  }}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    gameMode === 'versus'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow ring-1 ring-amber-400'
                      : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-lg">⚔️</div>
                  <div className="font-bold text-xs text-amber-400 leading-tight mt-0.5">Head-to-Head</div>
                  <div className="text-[10px] text-slate-300 leading-tight mt-0.5">Competitive Battle</div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Board / Format Selection (Classic List vs 3x3 Bingo Card) */}
        {mode === 'create' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                2. Challenge Format
              </label>
              <span className="text-[11px] font-bold text-purple-400">
                {boardFormat === 'bingo' ? '🎯 3x3 Bingo Card' : '📋 Classic List'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBoardFormat('standard');
                  setTargetWins(8);
                  sounds.playDing();
                }}
                className={`p-2 rounded-xl border text-center transition ${
                  boardFormat === 'standard'
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow ring-1 ring-blue-400'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-base">📋</div>
                <div className="font-bold text-xs text-blue-300 leading-tight mt-0.5">Classic List</div>
                <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Find item targets</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBoardFormat('bingo');
                  setTargetWins(1);
                  sounds.playDing();
                }}
                className={`p-2 rounded-xl border text-center transition ${
                  boardFormat === 'bingo'
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow ring-1 ring-purple-400'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-base">🎯</div>
                <div className="font-bold text-xs text-purple-300 leading-tight mt-0.5">3x3 Bingo Card</div>
                <div className="text-[9px] text-slate-400 leading-tight mt-0.5">Rows, cols & diagonals</div>
              </button>
            </div>
          </div>
        )}

        {/* Win Condition Selection if Creating */}
        {mode === 'create' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                3. {boardFormat === 'bingo'
                  ? (gameMode === 'coop' ? 'Team Bingo Goal' : 'Bingo Race Target')
                  : (gameMode === 'coop' ? 'Team Target (Find Together)' : 'Win Condition (First Partner)')}
              </label>
              <span className="text-xs font-bold text-amber-400">
                {boardFormat === 'bingo'
                  ? (targetWins === 9 ? 'Full 9 Blackout' : `${targetWins} Line(s)`)
                  : (gameMode === 'coop' ? `Goal: ${targetWins} Items` : `First to ${targetWins}`)}
              </span>
            </div>

            {boardFormat === 'bingo' ? (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { num: 1, label: '1 Line', desc: 'Any Row/Col/Diag' },
                  { num: 2, label: '2 Lines', desc: 'Double Bingo' },
                  { num: 9, label: 'Blackout', desc: 'All 9 Squares' }
                ].map((opt) => (
                  <button
                    key={opt.num}
                    type="button"
                    onClick={() => {
                      setTargetWins(opt.num);
                      sounds.playDing();
                    }}
                    className={`py-1.5 px-1.5 rounded-lg text-center border transition ${
                      targetWins === opt.num
                        ? 'bg-purple-500 text-white border-purple-400 shadow-md font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-black">{opt.label}</div>
                    <div className="text-[9px] opacity-80">{opt.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 8, 10, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setTargetWins(num);
                      sounds.playDing();
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      targetWins === num
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-extrabold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {num} {gameMode === 'coop' ? 'Items' : 'Wins'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : mode === 'create' ? (
            <>
              Create Couple's Game <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Join Room Now <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
