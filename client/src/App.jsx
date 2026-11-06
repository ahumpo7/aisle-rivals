import React, { useState, useEffect } from 'react';
import socket from './utils/socket';
import { sounds } from './utils/audio';
import Lobby from './components/Lobby';
import GameView from './components/GameView';
import SnapModal from './components/SnapModal';
import VerificationModal from './components/VerificationModal';
import GameOverModal from './components/GameOverModal';
import AddCustomPromptModal from './components/AddCustomPromptModal';

export default function App() {
  const [room, setRoom] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [pendingVerificationRequest, setPendingVerificationRequest] = useState(null);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);

  // Reconnection logic from localStorage
  useEffect(() => {
    const savedRoomCode = localStorage.getItem('aisle_rivals_room');
    const savedPlayerId = localStorage.getItem('aisle_rivals_player');

    if (savedRoomCode && savedPlayerId) {
      socket.emit('reconnect_player', {
        roomCode: savedRoomCode,
        playerId: savedPlayerId
      }, (res) => {
        if (res?.success) {
          setRoom(res.room);
          setPlayerId(savedPlayerId);
        } else {
          localStorage.removeItem('aisle_rivals_room');
          localStorage.removeItem('aisle_rivals_player');
        }
      });
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    // Room updated
    const handleRoomUpdated = (updatedRoom) => {
      setRoom(updatedRoom);
      // Check if there is an unreviewed submission from the opponent
      if (playerId && updatedRoom?.players) {
        const myOpponent = Object.values(updatedRoom.players).find((p) => p.id !== playerId);
        if (myOpponent && myOpponent.submissions) {
          const pendingPromptId = Object.keys(myOpponent.submissions).find(
            (id) => myOpponent.submissions[id].status === 'pending'
          );
          if (pendingPromptId) {
            const prompt = updatedRoom.prompts.find((p) => p.id === pendingPromptId);
            setPendingVerificationRequest({
              playerId: myOpponent.id,
              playerName: myOpponent.name,
              promptId: pendingPromptId,
              promptTitle: prompt ? prompt.title : 'Challenge Item',
              promptIcon: prompt ? prompt.icon : '📸',
              points: prompt ? prompt.points : 100,
              submission: myOpponent.submissions[pendingPromptId]
            });
          } else {
            setPendingVerificationRequest(null);
          }
        }
      }
    };

    // Partner submitted item
    const handlePartnerSubmitted = (data) => {
      sounds.playPartnerSubmitted();
      setPendingVerificationRequest({
        playerId: data.playerId,
        playerName: data.playerName,
        promptId: data.submission.promptId,
        promptTitle: data.promptTitle,
        promptIcon: data.promptIcon,
        points: data.submission.pointsEarned || 100,
        submission: data.submission
      });
      showToast(`🚨 ${data.playerName} found "${data.promptTitle}"! Tap to inspect!`);
    };

    // Item verification result
    const handleVerificationResult = (data) => {
      if (data.approved) {
        sounds.playApproved();
        showToast(`✅ ${data.reviewerName} approved ${data.targetPlayerName}'s find (+${data.points} pts)!`);
      } else {
        sounds.playRejected();
        showToast(`❌ ${data.reviewerName} rejected ${data.targetPlayerName}'s find: "${data.feedback}"`);
      }
    };

    // Item swapped alert
    const handleItemSwapped = (data) => {
      sounds.playDing();
      showToast(data.message || '🔄 A challenge was swapped for a new one!');
    };

    // Live Floating Reactions
    const handleLiveReaction = (data) => {
      sounds.playDing();
      const reactionId = Date.now() + Math.random();
      const randomLeft = 20 + Math.random() * 60; // 20% to 80% screen width
      const newReaction = {
        id: reactionId,
        emoji: data.emoji,
        left: `${randomLeft}%`
      };

      setFloatingReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
      }, 2000);
    };

    socket.on('room_updated', handleRoomUpdated);
    socket.on('partner_item_submitted', handlePartnerSubmitted);
    socket.on('item_verification_result', handleVerificationResult);
    socket.on('item_swapped_alert', handleItemSwapped);
    socket.on('live_reaction', handleLiveReaction);

    return () => {
      socket.off('room_updated', handleRoomUpdated);
      socket.off('partner_item_submitted', handlePartnerSubmitted);
      socket.off('item_verification_result', handleVerificationResult);
      socket.off('item_swapped_alert', handleItemSwapped);
      socket.off('live_reaction', handleLiveReaction);
    };
  }, [playerId]);

  const showToast = (message) => {
    setToastNotification(message);
    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleJoinSuccess = (joinedRoom, newPlayerId) => {
    setRoom(joinedRoom);
    setPlayerId(newPlayerId);
    localStorage.setItem('aisle_rivals_room', joinedRoom.roomCode);
    localStorage.setItem('aisle_rivals_player', newPlayerId);
  };

  const handleSubmitProof = (promptId, photoUrl, caption) => {
    if (!room || !playerId) return;
    socket.emit('submit_item', {
      roomCode: room.roomCode,
      playerId,
      promptId,
      photoUrl,
      caption
    });
  };

  const handleSwapPrompt = (promptId, callback) => {
    if (!room || !playerId) return;
    socket.emit('swap_item', {
      roomCode: room.roomCode,
      playerId,
      promptId
    }, (res) => {
      if (res?.success) {
        showToast(`🔄 Replaced with: "${res.newPrompt.title}"!`);
      } else {
        showToast(res?.error || 'Could not swap item');
      }
      if (callback) callback();
    });
  };

  const handleVerify = ({ targetPlayerId, promptId, approved, feedback }) => {
    if (!room || !playerId) return;
    socket.emit('verify_item', {
      roomCode: room.roomCode,
      reviewerId: playerId,
      targetPlayerId,
      promptId,
      approved,
      feedback
    });
    setPendingVerificationRequest(null);
  };

  const handleSendReaction = (emoji) => {
    if (!room || !playerId) return;
    socket.emit('send_reaction', {
      roomCode: room.roomCode,
      senderId: playerId,
      emoji
    });
  };

  const handleAddCustomPrompt = (promptData) => {
    if (!room || !playerId) return;
    socket.emit('add_custom_prompt', {
      roomCode: room.roomCode,
      playerId,
      promptData
    });
  };

  const handleRematch = () => {
    if (!room) return;
    socket.emit('reset_game', { roomCode: room.roomCode });
  };

  const player = room?.players?.[playerId];
  const opponent = Object.values(room?.players || {}).find((p) => p.id !== playerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Floating Reactions Layer */}
      {floatingReactions.map((r) => (
        <div
          key={r.id}
          className="floating-reaction text-5xl"
          style={{ left: r.left, bottom: '25%' }}
        >
          {r.emoji}
        </div>
      ))}

      {/* In-app Toast Banner */}
      {toastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-slate-800/95 border border-amber-400/80 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-bold text-center">
          {toastNotification}
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {!room || room.status === 'waiting' ? (
          <Lobby
            room={room}
            player={player}
            onJoinSuccess={handleJoinSuccess}
          />
        ) : (
          <GameView
            room={room}
            player={player}
            opponent={opponent}
            onOpenSnapModal={(prompt) => setSelectedPrompt(prompt)}
            onOpenVerification={(req) => setPendingVerificationRequest(req)}
            pendingVerificationRequest={pendingVerificationRequest}
            onSendReaction={handleSendReaction}
            onOpenAddPrompt={() => setShowAddPrompt(true)}
            onSwapPrompt={handleSwapPrompt}
          />
        )}
      </main>

      {/* Snap Photo Modal */}
      {selectedPrompt && (
        <SnapModal
          prompt={selectedPrompt}
          player={player}
          opponent={opponent}
          onClose={() => setSelectedPrompt(null)}
          onSubmitProof={handleSubmitProof}
          onSwapPrompt={handleSwapPrompt}
        />
      )}

      {/* Partner Proof Verification Modal */}
      {pendingVerificationRequest && (
        <VerificationModal
          request={pendingVerificationRequest}
          onVerify={handleVerify}
          onClose={() => setPendingVerificationRequest(null)}
        />
      )}

      {/* Custom Prompt Modal */}
      {showAddPrompt && (
        <AddCustomPromptModal
          onClose={() => setShowAddPrompt(false)}
          onAddPrompt={handleAddCustomPrompt}
        />
      )}

      {/* Game Over / Scrapbook Modal */}
      {room?.status === 'completed' && (
        <GameOverModal
          room={room}
          player={player}
          onRematch={handleRematch}
        />
      )}
    </div>
  );
}
