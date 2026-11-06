const { HUNT_PROMPTS } = require('./huntPrompts');
const { v4: uuidv4 } = require('uuid');

class GameManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostName, hostAvatar = '🦊', targetWins = 8, deckSize = 20) {
    const roomCode = this.generateRoomCode();
    const hostId = uuidv4();

    // Select 20 prompts for the match deck (or up to HUNT_PROMPTS.length)
    const shuffled = [...HUNT_PROMPTS].sort(() => 0.5 - Math.random());
    const matchDeckSize = Math.min(deckSize || 20, HUNT_PROMPTS.length);
    const selectedPrompts = shuffled.slice(0, matchDeckSize);

    const room = {
      roomCode,
      createdAt: Date.now(),
      status: 'waiting', // waiting, in_progress, completed
      deckSize: selectedPrompts.length,
      targetWins: Math.min(Number(targetWins) || 8, selectedPrompts.length), // First to X items/points wins!
      prompts: selectedPrompts,
      winner: null,
      players: {
        [hostId]: {
          id: hostId,
          name: hostName || 'Partner 1',
          avatar: hostAvatar,
          isHost: true,
          score: 0,
          verifiedCount: 0,
          submissions: {},
          connected: true,
          socketId: null
        }
      },
      activityLog: [
        {
          id: uuidv4(),
          type: 'room_created',
          message: `${hostName || 'Partner 1'} created Room ${roomCode}! First to ${targetWins || 8} verified items wins.`,
          timestamp: Date.now()
        }
      ]
    };

    this.rooms.set(roomCode, room);
    return { roomCode, playerId: hostId, room };
  }

  joinRoom(roomCode, playerName, playerAvatar = '🐼') {
    const upperCode = roomCode.toUpperCase().trim();
    const room = this.rooms.get(upperCode);
    if (!room) {
      return { error: 'Room not found! Check your 4-letter code.' };
    }

    const playerKeys = Object.keys(room.players);
    if (playerKeys.length >= 2) {
      // Check if an existing player is reconnecting by name
      const existingKey = playerKeys.find(
        (key) => room.players[key].name.toLowerCase() === playerName.trim().toLowerCase()
      );
      if (existingKey) {
        return { roomCode: upperCode, playerId: existingKey, room };
      }
      return { error: 'Room is already full with 2 players!' };
    }

    const playerId = uuidv4();
    room.players[playerId] = {
      id: playerId,
      name: playerName || 'Partner 2',
      avatar: playerAvatar,
      isHost: false,
      score: 0,
      verifiedCount: 0,
      submissions: {},
      connected: true,
      socketId: null
    };

    room.activityLog.push({
      id: uuidv4(),
      type: 'player_joined',
      message: `${room.players[playerId].name} joined the hunt! Both players ready.`,
      timestamp: Date.now()
    });

    return { roomCode: upperCode, playerId, room };
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode.toUpperCase().trim());
  }

  setPlayerSocket(roomCode, playerId, socketId) {
    const room = this.getRoom(roomCode);
    if (room && room.players[playerId]) {
      room.players[playerId].socketId = socketId;
      room.players[playerId].connected = true;
    }
  }

  startGame(roomCode, playerId) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const player = room.players[playerId];
    if (!player || !player.isHost) {
      return { error: 'Only the host can start the game!' };
    }
    if (Object.keys(room.players).length < 2) {
      return { error: 'Need 2 players before starting the hunt!' };
    }

    room.status = 'in_progress';
    room.startedAt = Date.now();
    room.activityLog.push({
      id: uuidv4(),
      type: 'game_started',
      message: `🏁 Scavenger Hunt started! 20 items in deck — First to verify ${room.targetWins} wins!`,
      timestamp: Date.now()
    });

    return { room };
  }

  // Swap / Replace an item if players don't like it
  swapPrompt(roomCode, playerId, promptId) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const player = room.players[playerId];
    if (!player) return { error: 'Player not found' };

    const promptIndex = room.prompts.findIndex((p) => p.id === promptId);
    if (promptIndex === -1) return { error: 'Prompt not found in deck' };

    const oldPrompt = room.prompts[promptIndex];

    // Find unused prompts from master pool
    const currentPromptIds = new Set(room.prompts.map((p) => p.id));
    const availablePrompts = HUNT_PROMPTS.filter((p) => !currentPromptIds.has(p.id));

    if (availablePrompts.length === 0) {
      return { error: 'No more unused prompts in the master deck!' };
    }

    // Pick random unused prompt
    const newPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    room.prompts[promptIndex] = newPrompt;

    // Clear submissions on the swapped item
    for (const pId in room.players) {
      if (room.players[pId].submissions[oldPrompt.id]) {
        delete room.players[pId].submissions[oldPrompt.id];
      }
    }

    room.activityLog.push({
      id: uuidv4(),
      type: 'item_swapped',
      message: `🔄 ${player.name} swapped out "${oldPrompt.title}" for "${newPrompt.title}"!`,
      timestamp: Date.now()
    });

    return { room, oldPrompt, newPrompt };
  }

  submitItemProof(roomCode, playerId, promptId, photoUrl, caption = '') {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const player = room.players[playerId];
    if (!player) return { error: 'Player not found' };

    const prompt = room.prompts.find((p) => p.id === promptId);
    if (!prompt) return { error: 'Prompt not found in game deck' };

    const submission = {
      promptId,
      promptTitle: prompt.title,
      promptIcon: prompt.icon,
      photoUrl,
      caption: caption.trim(),
      status: 'pending', // pending, approved, rejected
      submittedAt: Date.now(),
      feedback: '',
      pointsEarned: 0
    };

    player.submissions[promptId] = submission;

    room.activityLog.push({
      id: uuidv4(),
      type: 'item_submitted',
      playerId,
      playerName: player.name,
      promptTitle: prompt.title,
      promptIcon: prompt.icon,
      message: `📸 ${player.name} submitted proof for "${prompt.title}"! Waiting for verification...`,
      timestamp: Date.now()
    });

    return { room, submission, prompt };
  }

  verifyItemProof(roomCode, reviewerId, targetPlayerId, promptId, approved, feedback = '') {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };

    if (reviewerId === targetPlayerId) {
      return { error: 'You cannot verify your own submission! Your partner must verify it.' };
    }

    const reviewer = room.players[reviewerId];
    const targetPlayer = room.players[targetPlayerId];
    if (!reviewer || !targetPlayer) return { error: 'Player not found' };

    const submission = targetPlayer.submissions[promptId];
    if (!submission) return { error: 'No submission found for this prompt' };

    const prompt = room.prompts.find((p) => p.id === promptId);
    const points = prompt ? prompt.points : 100;

    submission.status = approved ? 'approved' : 'rejected';
    submission.feedback = feedback.trim();
    submission.reviewedBy = reviewer.name;
    submission.reviewedAt = Date.now();

    if (approved) {
      submission.pointsEarned = points;
      targetPlayer.score += points;
      targetPlayer.verifiedCount = Object.values(targetPlayer.submissions).filter(
        (s) => s.status === 'approved'
      ).length;

      room.activityLog.push({
        id: uuidv4(),
        type: 'item_approved',
        reviewerName: reviewer.name,
        targetPlayerName: targetPlayer.name,
        promptTitle: submission.promptTitle,
        points,
        feedback: submission.feedback,
        message: `✅ ${reviewer.name} verified ${targetPlayer.name}'s "${submission.promptTitle}" (+${points} pts)! (${targetPlayer.verifiedCount}/${room.targetWins} to win)`,
        timestamp: Date.now()
      });

      // Win Condition: First to targetWins (e.g. 5, 8, 10 items)
      if (targetPlayer.verifiedCount >= room.targetWins) {
        room.status = 'completed';
        room.completedAt = Date.now();
        room.winner = targetPlayer;
        room.activityLog.push({
          id: uuidv4(),
          type: 'game_won',
          message: `🏆 ${targetPlayer.name} reached the goal of ${room.targetWins} verified items and won the match!`,
          timestamp: Date.now()
        });
      }
    } else {
      submission.pointsEarned = 0;
      room.activityLog.push({
        id: uuidv4(),
        type: 'item_rejected',
        reviewerName: reviewer.name,
        targetPlayerName: targetPlayer.name,
        promptTitle: submission.promptTitle,
        feedback: submission.feedback,
        message: `❌ ${reviewer.name} rejected ${targetPlayer.name}'s "${submission.promptTitle}": "${feedback || 'Try again!'}"`,
        timestamp: Date.now()
      });
    }

    return { room, submission, approved, reviewer, targetPlayer };
  }

  addReaction(roomCode, senderId, emoji) {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    const sender = room.players[senderId];
    if (!sender) return null;

    return {
      senderId,
      senderName: sender.name,
      emoji,
      id: uuidv4(),
      timestamp: Date.now()
    };
  }

  addCustomPrompt(roomCode, playerId, promptData) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };

    const newPrompt = {
      id: `custom-${Date.now()}`,
      title: promptData.title || 'Couple Inside Joke Challenge',
      icon: promptData.icon || '🎯',
      category: 'Couples Custom',
      badge: 'Custom',
      points: Number(promptData.points) || 150,
      description: promptData.description || 'Find this custom store challenge!',
      hint: promptData.hint || 'Good luck!',
      verificationCriteria: 'Partner verification required.'
    };

    room.prompts.unshift(newPrompt); // Add to beginning of deck
    room.deckSize = room.prompts.length;

    room.activityLog.push({
      id: uuidv4(),
      type: 'custom_prompt_added',
      message: `✨ New challenge added: "${newPrompt.title}"`,
      timestamp: Date.now()
    });

    return { room, newPrompt };
  }

  resetGame(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };

    room.status = 'in_progress';
    room.winner = null;
    room.startedAt = Date.now();
    for (const pId in room.players) {
      room.players[pId].score = 0;
      room.players[pId].verifiedCount = 0;
      room.players[pId].submissions = {};
    }

    room.activityLog.push({
      id: uuidv4(),
      type: 'game_reset',
      message: `🔄 Game has been rematched! Scores reset. Go!`,
      timestamp: Date.now()
    });

    return { room };
  }
}

module.exports = new GameManager();
