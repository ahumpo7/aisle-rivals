import React, { useEffect } from 'react';
import { Trophy, Crown, Sparkles, RotateCcw, Heart, Share2, CheckCircle2, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function GameOverModal({ room, player, onRematch, onLeaveToMainMenu }) {
  const winner = room?.winner;
  const isWinner = winner?.id === player?.id;
  const playersList = Object.values(room?.players || {});
  const opponent = playersList.find((p) => p.id !== player?.id);

  useEffect(() => {
    sounds.playVictory();
    // Big confetti blast
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-400/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-6 text-center text-slate-950 relative overflow-hidden">
          <div className="text-5xl mb-2 animate-bounce">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            {winner?.name} Wins!
          </h2>
          <p className="text-xs sm:text-sm font-bold opacity-90">
            {isWinner ? "You're the Walmart Scavenger Champion!" : "Better luck next Walmart date night!"}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm flex-1">
          {/* Scoreboard Recap */}
          <div className="grid grid-cols-2 gap-3">
            {playersList.map((p) => {
              const isPWinner = p.id === winner?.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border text-center space-y-1 relative ${
                    isPWinner
                      ? 'bg-amber-400/10 border-amber-400/60 shadow-lg'
                      : 'bg-slate-800/80 border-slate-700/80'
                  }`}
                >
                  {isPWinner && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3" /> Winner
                    </span>
                  )}
                  <div className="text-3xl pt-1">{p.avatar}</div>
                  <div className="font-extrabold text-white text-base truncate">{p.name}</div>
                  <div className="text-2xl font-black text-amber-400">{p.score} <span className="text-xs text-slate-400 font-normal">pts</span></div>
                  <div className="text-[11px] text-slate-400">
                    {p.verifiedCount} / {room.prompts.length} items found
                  </div>
                </div>
              );
            })}
          </div>

          {/* Couples Memory Scrapbook of Finds */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Couple's Photo Scrapbook
              </h3>
              <span className="text-xs text-slate-400">Walmart Discoveries</span>
            </div>

            <div className="space-y-4">
              {room.prompts.map((prompt) => {
                const p1 = playersList[0];
                const p2 = playersList[1];
                const p1Sub = p1?.submissions?.[prompt.id];
                const p2Sub = p2?.submissions?.[prompt.id];

                if (!p1Sub && !p2Sub) return null;

                return (
                  <div key={prompt.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{prompt.icon}</span>
                      <span className="font-bold text-white text-xs">{prompt.title}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* P1 find */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 truncate font-semibold">
                          {p1?.avatar} {p1?.name}
                        </div>
                        {p1Sub?.photoUrl ? (
                          <div className="relative rounded-xl overflow-hidden aspect-square bg-black border border-slate-700">
                            <img src={p1Sub.photoUrl} alt="find" className="w-full h-full object-cover" />
                            {p1Sub.status === 'approved' && (
                              <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-square bg-slate-900/60 rounded-xl border border-dashed border-slate-700/80 flex items-center justify-center text-[10px] text-slate-500">
                            Not Found
                          </div>
                        )}
                        {p1Sub?.caption && (
                          <p className="text-[10px] text-slate-300 italic truncate">"{p1Sub.caption}"</p>
                        )}
                      </div>

                      {/* P2 find */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 truncate font-semibold">
                          {p2?.avatar} {p2?.name}
                        </div>
                        {p2Sub?.photoUrl ? (
                          <div className="relative rounded-xl overflow-hidden aspect-square bg-black border border-slate-700">
                            <img src={p2Sub.photoUrl} alt="find" className="w-full h-full object-cover" />
                            {p2Sub.status === 'approved' && (
                              <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="aspect-square bg-slate-900/60 rounded-xl border border-dashed border-slate-700/80 flex items-center justify-center text-[10px] text-slate-500">
                            Not Found
                          </div>
                        )}
                        {p2Sub?.caption && (
                          <p className="text-[10px] text-slate-300 italic truncate">"{p2Sub.caption}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              onClick={onRematch}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" /> Start Rematch!
            </button>
            <button
              onClick={onLeaveToMainMenu}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 active:scale-95 transition flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
