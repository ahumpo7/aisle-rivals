const { HUNT_PROMPTS, getTheme, getPromptsByTheme, LIGHTNING_CHALLENGES, SABOTAGE_POWERUPS } = require('./huntPrompts');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

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

  createRoom(hostName, hostAvatar = '🦊', targetWins = 8, deckSize = 20, gameMode = 'coop', themeId = 'supermarket', boardFormat = 'standard') {
    const roomCode = this.generateRoomCode();
    const hostId = uuidv4();

    const selectedTheme = getTheme(themeId);
    const themePrompts = getPromptsByTheme(selectedTheme.id);

    const isCoopOnly = selectedTheme.id === 'roadtrip' || selectedTheme.coopOnly;

    // Bingo option can be chosen for either Head-to-Head or Team Battle
    const isBingo = boardFormat === 'bingo' || gameMode === 'bingo';
    const format = isBingo ? 'bingo' : 'standard';

    let mode = 'coop';
    if (isCoopOnly) {
      mode = 'coop';
    } else if (gameMode === 'versus') {
      mode = 'versus';
    } else if (gameMode === 'bingo') {
      mode = 'versus'; // legacy fallback
    } else {
      mode = 'coop';
    }

    // Select prompts for the match deck (9 for 3x3 Bingo grid)
    const shuffled = [...themePrompts].sort(() => 0.5 - Math.random());
    const matchDeckSize = isBingo ? 9 : Math.min(deckSize || 20, themePrompts.length);
    const selectedPrompts = shuffled.slice(0, matchDeckSize);

    // For bingo, targetWins represents lines (1, 2) or blackout (9)
    const effectiveTargetWins = isBingo
      ? (Number(targetWins) === 9 ? 9 : (Number(targetWins) === 2 ? 2 : 1))
      : Math.min(Number(targetWins) || 8, selectedPrompts.length);

    const safetyNote = isCoopOnly ? ' (🚗 Driving Safety: Team Co-Op Only!)' : '';

    const room = {
      roomCode,
      createdAt: Date.now(),
      status: 'waiting', // waiting, in_progress, completed
      gameMode: mode, // 'coop' or 'versus'
      boardFormat: format, // 'standard' or 'bingo'
      isBingo,
      coopOnly: isCoopOnly,
      themeId: selectedTheme.id,
      themeName: selectedTheme.name,
      themeShortName: selectedTheme.shortName,
      themeIcon: selectedTheme.icon,
      themeSubtitle: selectedTheme.subtitle,
      themeBadgeColor: selectedTheme.badgeColor,
      deckSize: selectedPrompts.length,
      targetWins: effectiveTargetWins,
      prompts: selectedPrompts,
      winner: null,
      teamScore: 0,
      teamVerifiedCount: 0,
      teamBingoLinesCount: 0,
      lightningFrenzy: null,
      activeSabotages: {},
      bingoClaims: {},
      players: {
        [hostId]: {
          id: hostId,
          name: hostName || 'Partner 1',
          avatar: hostAvatar,
          isHost: true,
          score: 0,
          verifiedCount: 0,
          bingoLinesCount: 0,
          submissions: {},
          powerups: ['freeze', 'opposite_hand', 'slow_mo'],
          connected: true,
          socketId: null
        }
      },
      activityLog: [
        {
          id: uuidv4(),
          type: 'room_created',
          message: `${hostName || 'Partner 1'} created Room ${roomCode}! Theme: ${selectedTheme.icon} ${selectedTheme.name} • ${
            mode === 'coop' ? '🤝 Team Effort' : '⚔️ Head-to-Head'
          } [${isBingo ? '🎯 3x3 Bingo Card' : '📋 Classic List'}]${safetyNote} (Goal: ${
            isBingo ? (effectiveTargetWins === 9 ? 'Full Blackout' : effectiveTargetWins + ' Line(s)') : effectiveTargetWins + ' items'
          }).`,
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
      bingoLinesCount: 0,
      submissions: {},
      powerups: ['freeze', 'opposite_hand', 'slow_mo'],
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
    const modeMsg = room.gameMode === 'coop'
      ? `🤝 Team Effort active! Work together to find and verify ${room.targetWins} items!`
      : `⚔️ Head-to-Head active! First partner to verify ${room.targetWins} items wins!`;

    room.activityLog.push({
      id: uuidv4(),
      type: 'game_started',
      message: `🏁 Scavenger Hunt started! ${modeMsg}`,
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

    const pool = getPromptsByTheme(room.themeId || 'supermarket');
    const currentPromptIds = new Set(room.prompts.map((p) => p.id));
    let availablePrompts = pool.filter((p) => !currentPromptIds.has(p.id));

    // Fallback: If all prompts were already dealt, allow swapping to any other prompt in the theme
    if (availablePrompts.length === 0) {
      availablePrompts = pool.filter((p) => p.id !== oldPrompt.id);
    }

    if (availablePrompts.length === 0) {
      return { error: 'No replacement prompts available in this theme deck!' };
    }

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

  submitItemProof(roomCode, playerId, promptId, photoUrl, caption = '', isLightning = false) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const player = room.players[playerId];
    if (!player) return { error: 'Player not found' };

    let prompt = room.prompts.find((p) => p.id === promptId);
    let promptTitle = prompt?.title;
    let promptIcon = prompt?.icon || '📸';
    let isFrenzySubmission = false;
    let multiplier = 1;

    if (isLightning && room.lightningFrenzy && Date.now() < room.lightningFrenzy.endsAt) {
      isFrenzySubmission = true;
      multiplier = room.lightningFrenzy.multiplier || 2;
      promptTitle = `⚡ ${room.lightningFrenzy.title}`;
      promptIcon = room.lightningFrenzy.icon || '⚡';
    }

    if (!prompt && !isFrenzySubmission) return { error: 'Prompt not found in game deck' };

    const submission = {
      promptId: isFrenzySubmission ? 'lightning-frenzy' : promptId,
      promptTitle,
      promptIcon,
      photoUrl,
      caption: caption.trim(),
      status: 'pending',
      submittedAt: Date.now(),
      feedback: '',
      pointsEarned: 0,
      isLightning: isFrenzySubmission,
      multiplier,
      isSecretGift: !!prompt?.isSecretGift
    };

    player.submissions[submission.promptId] = submission;

    room.activityLog.push({
      id: uuidv4(),
      type: 'item_submitted',
      playerId,
      playerName: player.name,
      promptTitle: submission.promptTitle,
      promptIcon: submission.promptIcon,
      message: `📸 ${player.name} submitted proof for "${submission.promptTitle}"! Waiting for verification...`,
      timestamp: Date.now()
    });

    return { room, submission, prompt: prompt || { title: promptTitle, icon: promptIcon, points: 150 } };
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
    let points = prompt ? prompt.points : 100;
    if (submission.isLightning && submission.multiplier) {
      points = Math.round(150 * submission.multiplier);
    }

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

      // Handle Co-Op vs Versus
      if (room.gameMode === 'coop') {
        const uniqueVerifiedPrompts = new Set();
        let totalScore = 0;
        for (const p of Object.values(room.players)) {
          for (const sub of Object.values(p.submissions)) {
            if (sub.status === 'approved') {
              uniqueVerifiedPrompts.add(sub.promptId);
              totalScore += (sub.pointsEarned || 0);
            }
          }
        }
        room.teamVerifiedCount = uniqueVerifiedPrompts.size;
        room.teamScore = totalScore;

        if (room.isBingo) {
          // Team Effort + 3x3 Bingo Card
          room.teamBingoLinesCount = this.countTeamCompletedBingoLines(room);
          const isBlackoutTarget = room.targetWins === 9;
          const isTeamBingoWin = isBlackoutTarget
            ? room.teamVerifiedCount >= 9
            : room.teamBingoLinesCount >= room.targetWins;

          room.activityLog.push({
            id: uuidv4(),
            type: 'item_approved',
            reviewerName: reviewer.name,
            targetPlayerName: targetPlayer.name,
            promptTitle: submission.promptTitle,
            points,
            feedback: submission.feedback,
            message: `✅ ${reviewer.name} verified ${targetPlayer.name}'s "${submission.promptTitle}" (+${points} team pts)! (Team: ${
              isBlackoutTarget
                ? `${room.teamVerifiedCount}/9 Blackout`
                : `${room.teamBingoLinesCount}/${room.targetWins} Bingo Line(s)`
            })`,
            timestamp: Date.now()
          });

          if (isTeamBingoWin) {
            room.status = 'completed';
            room.completedAt = Date.now();
            room.winner = {
              id: 'team',
              isTeam: true,
              name: 'Couple Power Team',
              score: room.teamScore,
              verifiedCount: room.teamVerifiedCount
            };
            room.activityLog.push({
              id: uuidv4(),
              type: 'game_won',
              message: `🎯 TEAM BINGO! The couple completed ${
                isBlackoutTarget ? 'the full 9-square Blackout' : `${room.targetWins} line(s)`
              } together with ${room.teamScore} points!`,
              timestamp: Date.now()
            });
          }
        } else {
          // Standard Co-op Hunt
          room.activityLog.push({
            id: uuidv4(),
            type: 'item_approved',
            reviewerName: reviewer.name,
            targetPlayerName: targetPlayer.name,
            promptTitle: submission.promptTitle,
            points,
            feedback: submission.feedback,
            message: `✅ ${reviewer.name} verified ${targetPlayer.name}'s "${submission.promptTitle}" (+${points} team pts)! (Team: ${room.teamVerifiedCount}/${room.targetWins})`,
            timestamp: Date.now()
          });

          // Co-op Win Condition
          if (room.teamVerifiedCount >= room.targetWins) {
            room.status = 'completed';
            room.completedAt = Date.now();
            room.winner = {
              id: 'team',
              isTeam: true,
              name: 'Couple Power Team',
              score: room.teamScore,
              verifiedCount: room.teamVerifiedCount
            };
            room.activityLog.push({
              id: uuidv4(),
              type: 'game_won',
              message: `🏆 Couple Team Mission Accomplished! Found all ${room.targetWins} items together with ${room.teamScore} points!`,
              timestamp: Date.now()
            });
          }
        }
      } else {
        // Versus Mode (Head-to-Head)
        if (room.isBingo) {
          // Dedicated 3x3 Bingo Card Head-to-Head Race
          targetPlayer.bingoLinesCount = this.countCompletedBingoLines(room, targetPlayer);

          const isBlackoutTarget = room.targetWins === 9;
          const isBingoWin = isBlackoutTarget
            ? targetPlayer.verifiedCount >= 9
            : targetPlayer.bingoLinesCount >= room.targetWins;

          room.activityLog.push({
            id: uuidv4(),
            type: 'item_approved',
            reviewerName: reviewer.name,
            targetPlayerName: targetPlayer.name,
            promptTitle: submission.promptTitle,
            points,
            feedback: submission.feedback,
            message: `✅ ${reviewer.name} verified ${targetPlayer.name}'s "${submission.promptTitle}" (+${points} pts)! (${
              isBlackoutTarget
                ? `${targetPlayer.verifiedCount}/9 Blackout`
                : `${targetPlayer.bingoLinesCount}/${room.targetWins} Bingo Line(s)`
            })`,
            timestamp: Date.now()
          });

          if (isBingoWin) {
            room.status = 'completed';
            room.completedAt = Date.now();
            room.winner = targetPlayer;
            room.activityLog.push({
              id: uuidv4(),
              type: 'game_won',
              message: `🎯 BINGO! ${targetPlayer.name} completed ${
                isBlackoutTarget ? 'the full 9-square Blackout' : `${room.targetWins} line(s)`
              } and won the Bingo Faceoff!`,
              timestamp: Date.now()
            });
          }
        } else {
          // Standard Head-to-Head Hunt
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
        }
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

  countCompletedBingoLines(room, player) {
    if (!room || !player || !room.isBingo) return 0;
    const prompts = room.prompts || [];
    if (prompts.length < 9) return 0;

    const subs = player.submissions || {};
    const isApproved = (idx) => {
      const p = prompts[idx];
      return p && subs[p.id]?.status === 'approved';
    };

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let completed = 0;
    for (const line of lines) {
      if (line.every(isApproved)) {
        completed++;
      }
    }
    return completed;
  }

  countTeamCompletedBingoLines(room) {
    if (!room || !room.isBingo) return 0;
    const prompts = room.prompts || [];
    if (prompts.length < 9) return 0;

    const isApproved = (idx) => {
      const p = prompts[idx];
      if (!p) return false;
      return Object.values(room.players || {}).some(
        (player) => player.submissions?.[p.id]?.status === 'approved'
      );
    };

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let completed = 0;
    for (const line of lines) {
      if (line.every(isApproved)) {
        completed++;
      }
    }
    return completed;
  }

  triggerLightningFrenzy(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const randomChallenge = LIGHTNING_CHALLENGES[Math.floor(Math.random() * LIGHTNING_CHALLENGES.length)];
    const frenzy = {
      id: uuidv4(),
      title: randomChallenge.title,
      icon: randomChallenge.icon,
      multiplier: randomChallenge.multiplier,
      hint: randomChallenge.hint,
      startedAt: Date.now(),
      endsAt: Date.now() + 180000 // 3 minutes
    };
    room.lightningFrenzy = frenzy;
    room.activityLog.push({
      id: uuidv4(),
      type: 'lightning_frenzy',
      message: `⚡ FLASH FRENZY: "${frenzy.title}" for ${frenzy.multiplier}X BONUS POINTS in the next 3 mins!`,
      timestamp: Date.now()
    });
    return { room, frenzy };
  }

  usePowerup(roomCode, senderId, targetPlayerId, powerupId) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const sender = room.players[senderId];
    const target = room.players[targetPlayerId];
    if (!sender || !target) return { error: 'Player not found' };

    const powerupDef = SABOTAGE_POWERUPS.find((p) => p.id === powerupId);
    if (!powerupDef) return { error: 'Unknown power-up' };

    const idx = (sender.powerups || []).indexOf(powerupId);
    if (idx !== -1) {
      sender.powerups.splice(idx, 1);
    }

    const durationMs = (powerupDef.durationSeconds || 20) * 1000;
    const endsAt = Date.now() + durationMs;
    if (!room.activeSabotages) room.activeSabotages = {};
    const sabotage = {
      id: powerupDef.id,
      name: powerupDef.name,
      icon: powerupDef.icon,
      description: powerupDef.description,
      senderName: sender.name,
      endsAt
    };
    room.activeSabotages[targetPlayerId] = sabotage;

    room.activityLog.push({
      id: uuidv4(),
      type: 'sabotage_used',
      message: `🃏 ${sender.name} played ${powerupDef.icon} ${powerupDef.name} on ${target.name}!`,
      timestamp: Date.now()
    });

    return { room, sabotage, sender, target };
  }

  claimBingo(roomCode, playerId, lineType) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const player = room.players[playerId];
    if (!player) return { error: 'Player not found' };

    if (!room.bingoClaims) room.bingoClaims = {};
    const claimKey = `${playerId}-${lineType}`;
    if (room.bingoClaims[claimKey]) {
      return { error: 'Bingo line already claimed!' };
    }
    room.bingoClaims[claimKey] = Date.now();

    const bonus = 300;
    player.score += bonus;
    if (room.gameMode === 'coop') {
      room.teamScore += bonus;
    }

    room.activityLog.push({
      id: uuidv4(),
      type: 'bingo_claimed',
      message: `🎉 BINGO! ${player.name} completed a 3x3 line (${lineType}) and claimed +${bonus} BONUS POINTS!`,
      timestamp: Date.now()
    });

    return { room, bonus, player };
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

    room.prompts.unshift(newPrompt);
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
    room.teamScore = 0;
    room.teamVerifiedCount = 0;
    room.teamBingoLinesCount = 0;
    room.lightningFrenzy = null;
    room.activeSabotages = {};
    room.bingoClaims = {};
    room.startedAt = Date.now();

    // Re-shuffle a fresh match deck for the active theme (9 for bingo)
    const pool = getPromptsByTheme(room.themeId || 'supermarket');
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const matchDeckSize = room.isBingo ? 9 : Math.min(room.deckSize || 20, pool.length);
    room.prompts = shuffled.slice(0, matchDeckSize);

    for (const pId in room.players) {
      room.players[pId].score = 0;
      room.players[pId].verifiedCount = 0;
      room.players[pId].bingoLinesCount = 0;
      room.players[pId].submissions = {};
      room.players[pId].powerups = ['freeze', 'opposite_hand', 'slow_mo'];
    }

    room.activityLog.push({
      id: uuidv4(),
      type: 'game_reset',
      message: `🔄 Game has been rematched with fresh ${room.themeName} challenges! Scores reset. Go!`,
      timestamp: Date.now()
    });

    return { room };
  }

  endGameEarly(roomCode, requesterId) {
    const room = this.getRoom(roomCode);
    if (!room) return { error: 'Room not found' };
    const requester = room.players[requesterId];

    room.status = 'completed';
    room.completedAt = Date.now();

    if (room.gameMode === 'coop') {
      room.winner = {
        id: 'team',
        isTeam: true,
        name: 'Couple Power Team',
        score: room.teamScore,
        verifiedCount: room.teamVerifiedCount
      };
      room.activityLog.push({
        id: uuidv4(),
        type: 'game_ended_early',
        message: `🏁 ${requester ? requester.name : 'Match'} concluded the team hunt! Total Score: ${room.teamScore} pts with ${room.teamVerifiedCount} items found together!`,
        timestamp: Date.now()
      });
    } else {
      const playersList = Object.values(room.players);
      let topPlayer = playersList[0];
      for (const p of playersList) {
        if (p.score > (topPlayer?.score || 0)) {
          topPlayer = p;
        }
      }
      room.winner = topPlayer;
      room.activityLog.push({
        id: uuidv4(),
        type: 'game_ended_early',
        message: `🏁 ${requester ? requester.name : 'Match'} ended the hunt early! ${topPlayer ? topPlayer.name + ' wins!' : ''}`,
        timestamp: Date.now()
      });
    }

    return { room };
  }
}

module.exports = new GameManager();
