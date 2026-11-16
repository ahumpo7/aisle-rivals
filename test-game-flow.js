process.env.NO_TUNNEL = 'true';
process.env.PORT = '3005';
const { io } = require('./client/node_modules/socket.io-client');
const http = require('http');

async function testGameFlow() {
  console.log('🧪 Starting End-to-End Game Flow Simulation (Multi-Theme & Co-Op Support)...');

  // Start the actual server in-process if not already listening
  const serverModule = require('./server/server');

  // Wait a moment for server to bind
  await new Promise((r) => setTimeout(r, 600));

  const serverUrl = 'http://localhost:3005';

  const socket1 = io(serverUrl);
  const socket2 = io(serverUrl);

  await new Promise((resolve) => socket1.on('connect', resolve));
  await new Promise((resolve) => socket2.on('connect', resolve));
  console.log('✅ Both players connected via WebSocket');

  // Test all themes are available via API
  const httpRes = await fetch('http://localhost:3005/api/themes');
  const themesJson = await httpRes.json();
  console.log(`✅ Themes endpoint returned ${themesJson.themes.length} themes:`, themesJson.themes.map(t => `${t.icon} ${t.shortName}`).join(', '));
  if (themesJson.themes.length < 5) throw new Error('Expected at least 5 themes');

  // Step 1: Create room in Co-Op mode with 'nature' theme
  const createRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Alex',
      hostAvatar: '🦊',
      targetWins: 5,
      deckSize: 20,
      gameMode: 'coop',
      themeId: 'nature'
    }, resolve);
  });

  if (!createRes.success) throw new Error('Create room failed: ' + createRes.error);
  const roomCode = createRes.roomCode;
  const p1Id = createRes.playerId;
  console.log(`✅ Nature Co-op Room created: ${roomCode} (Theme: ${createRes.room.themeIcon} ${createRes.room.themeName}, GameMode: ${createRes.room.gameMode}, Goal: ${createRes.room.targetWins})`);

  if (createRes.room.themeId !== 'nature') {
    throw new Error(`Expected themeId 'nature', got ${createRes.room.themeId}`);
  }

  // Step 2: Join room
  const joinRes = await new Promise((resolve) => {
    socket2.emit('join_room', {
      roomCode,
      playerName: 'Sam',
      playerAvatar: '🐼'
    }, resolve);
  });
  if (!joinRes.success) throw new Error('Join room failed: ' + joinRes.error);
  const p2Id = joinRes.playerId;
  console.log(`✅ Player 2 (Sam) joined Nature Hunt!`);

  // Step 3: Start game
  const startRes = await new Promise((resolve) => {
    socket1.emit('start_game', { roomCode, playerId: p1Id }, resolve);
  });
  if (!startRes.success) throw new Error('Start game failed: ' + startRes.error);
  console.log(`✅ Match started with ${startRes.room.prompts.length} nature challenges!`);

  // Step 4: Test item swapping in nature theme
  const promptToSwap = startRes.room.prompts[1];
  const swapRes = await new Promise((resolve) => {
    socket1.emit('swap_item', {
      roomCode,
      playerId: p1Id,
      promptId: promptToSwap.id
    }, resolve);
  });
  if (!swapRes.success) throw new Error('Swap item failed: ' + swapRes.error);
  console.log(`✅ Successfully swapped item: "${swapRes.oldPrompt.title}" -> "${swapRes.newPrompt.title}"`);

  // Step 5: Player 1 submits proof for the team
  const firstPrompt = startRes.room.prompts[0];
  const alertPromise = new Promise((resolve) => {
    socket2.on('partner_item_submitted', (data) => {
      console.log(`🔔 Player 2 received alert: ${data.message}`);
      resolve(data);
    });
  });

  socket1.emit('submit_item', {
    roomCode,
    playerId: p1Id,
    promptId: firstPrompt.id,
    photoUrl: '/uploads/sample-nature-heart-rock.jpg',
    caption: 'Found this heart-shaped rock on the trail for our team goal!'
  });

  await alertPromise;

  // Step 6: Player 2 approves item for the team
  const approvalPromise = new Promise((resolve) => {
    socket1.on('item_verification_result', (data) => {
      console.log(`🎉 Verification received! Points: +${data.points}, Room team score: ${data.room.teamScore}`);
      resolve(data);
    });
  });

  socket2.emit('verify_item', {
    roomCode,
    reviewerId: p2Id,
    targetPlayerId: p1Id,
    promptId: firstPrompt.id,
    approved: true,
    feedback: 'Beautiful nature find for the team! Approved!'
  });

  const approvalResult = await approvalPromise;
  if (!approvalResult.approved || approvalResult.room.teamVerifiedCount !== 1) {
    throw new Error('Co-Op team score calculation failed');
  }
  console.log(`✅ Team verified count is now ${approvalResult.room.teamVerifiedCount}/${approvalResult.room.targetWins} (Team Score: ${approvalResult.room.teamScore} pts)`);

  // Step 7: Test City theme room creation
  const createCityRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Taylor',
      hostAvatar: '🐯',
      targetWins: 8,
      deckSize: 20,
      gameMode: 'versus',
      themeId: 'city'
    }, resolve);
  });
  if (!createCityRes.success || createCityRes.room.themeId !== 'city') {
    throw new Error('City theme room creation failed');
  }
  console.log(`✅ City Stroll Versus Room created: ${createCityRes.roomCode} (Theme: ${createCityRes.room.themeIcon} ${createCityRes.room.themeName})`);

  // Step 8: Test Road Trip theme (Safety Enforced Co-Op Only)
  const createRoadTripRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Driver & Copilot',
      hostAvatar: '🚗',
      targetWins: 8,
      deckSize: 20,
      gameMode: 'versus', // Intentionally requested versus
      themeId: 'roadtrip'
    }, resolve);
  });
  if (!createRoadTripRes.success || createRoadTripRes.room.themeId !== 'roadtrip') {
    throw new Error('Road Trip room creation failed');
  }
  if (createRoadTripRes.room.gameMode !== 'coop' || !createRoadTripRes.room.coopOnly) {
    throw new Error(`Expected Road Trip to enforce gameMode 'coop' and coopOnly=true, got mode=${createRoadTripRes.room.gameMode}`);
  }
  console.log(`✅ Road Trip Safety Enforced! Mode: ${createRoadTripRes.room.gameMode} (coopOnly: ${createRoadTripRes.room.coopOnly}, Theme: ${createRoadTripRes.room.themeIcon} ${createRoadTripRes.room.themeName})`);

  // Step 9: Test Casino & Boardwalk theme room creation
  const createCasinoRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Lucky Roller',
      hostAvatar: '🎰',
      targetWins: 8,
      deckSize: 20,
      gameMode: 'versus',
      themeId: 'casino'
    }, resolve);
  });
  if (!createCasinoRes.success || createCasinoRes.room.themeId !== 'casino') {
    throw new Error('Casino theme room creation failed');
  }
  const casinoPrompt = createCasinoRes.room.prompts[0];
  console.log(`✅ Casino & Boardwalk Room created: ${createCasinoRes.roomCode} (Theme: ${createCasinoRes.room.themeIcon} ${createCasinoRes.room.themeName}, Sample Challenge: "${casinoPrompt.title}")`);

  // Step 10: Test Riddles & Cryptic Clues theme
  const createRiddleRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Sherlock',
      hostAvatar: '🕵️',
      targetWins: 5,
      deckSize: 20,
      gameMode: 'coop',
      themeId: 'riddles'
    }, resolve);
  });
  if (!createRiddleRes.success || createRiddleRes.room.themeId !== 'riddles') {
    throw new Error('Riddles theme room creation failed');
  }
  const sampleRiddle = createRiddleRes.room.prompts.find((p) => p.isRiddle);
  if (!sampleRiddle || !sampleRiddle.riddleClue) {
    throw new Error('Expected riddle prompts to contain isRiddle and riddleClue');
  }
  console.log(`✅ Cryptic Riddle Theme created! Sample Clue: "${sampleRiddle.title}" (Answer: ${sampleRiddle.riddleAnswer})`);

  // Step 11: Test Assemble-a-Date Picnic Quest & Secret Gift
  const createPicnicRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Picnic Lovers',
      hostAvatar: '🧺',
      targetWins: 5,
      deckSize: 20,
      gameMode: 'coop',
      themeId: 'picnic'
    }, resolve);
  });
  if (!createPicnicRes.success || createPicnicRes.room.themeId !== 'picnic') {
    throw new Error('Picnic theme room creation failed');
  }
  const secretGiftPrompt = createPicnicRes.room.prompts.find((p) => p.isSecretGift);
  if (!secretGiftPrompt) {
    throw new Error('Expected Picnic theme to contain a Secret Under-$5 Gift prompt');
  }
  console.log(`✅ Picnic & Feast Theme created! Contains: "${secretGiftPrompt.title}" (isSecretGift: true)`);

  // Step 12: Test 5 Senses Adventure
  const createSensesRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Sensory Squad',
      hostAvatar: '👃',
      targetWins: 5,
      deckSize: 20,
      gameMode: 'versus',
      themeId: 'senses'
    }, resolve);
  });
  if (!createSensesRes.success || createSensesRes.room.themeId !== 'senses') {
    throw new Error('5 Senses theme room creation failed');
  }
  console.log(`✅ 5 Senses Adventure Theme created with ${createSensesRes.room.prompts.length} sensory challenges!`);

  // Step 13: Test Lightning Frenzy Flash Quest Event
  const frenzyPromise = new Promise((resolve) => {
    socket2.on('lightning_frenzy_alert', (data) => {
      console.log(`⚡ Received Lightning Frenzy Alert: "${data.frenzy.title}" (${data.frenzy.multiplier}X Points)!`);
      resolve(data);
    });
  });

  const lightningRes = await new Promise((resolve) => {
    socket1.emit('trigger_lightning', { roomCode }, resolve);
  });
  if (!lightningRes.success || !lightningRes.frenzy) {
    throw new Error('Trigger lightning frenzy failed');
  }
  await frenzyPromise;
  console.log(`✅ Lightning Frenzy triggered and broadcast successfully!`);

  // Step 14: Test Playful Sabotage Power-Up in Versus Mode
  const sabotagePromise = new Promise((resolve) => {
    socket2.on('sabotage_triggered', (data) => {
      console.log(`🃏 Received Sabotage Alert: ${data.message}`);
      resolve(data);
    });
  });

  const powerupRes = await new Promise((resolve) => {
    socket1.emit('use_powerup', {
      roomCode,
      senderId: p1Id,
      targetPlayerId: p2Id,
      powerupId: 'freeze'
    }, resolve);
  });
  if (!powerupRes.success || !powerupRes.sabotage) {
    throw new Error('Use sabotage powerup failed');
  }
  await sabotagePromise;
  console.log(`✅ Sabotage Power-Up (Aisle Freeze) executed and broadcast!`);

  // Step 15: Test Claiming 3x3 Bingo Bonus
  const bingoPromise = new Promise((resolve) => {
    socket2.on('bingo_claimed_alert', (data) => {
      console.log(`🎉 Received Bingo Alert: ${data.message} (+${data.bonus} pts)`);
      resolve(data);
    });
  });

  const bingoRes = await new Promise((resolve) => {
    socket1.emit('claim_bingo', {
      roomCode,
      playerId: p1Id,
      lineType: 'Row 1'
    }, resolve);
  });
  if (!bingoRes.success || bingoRes.bonus !== 300) {
    throw new Error('Claim bingo failed');
  }
  await bingoPromise;
  console.log(`✅ 3x3 Bingo claimed and bonus points awarded (+300 pts)!`);

  // Step 16: Test Dedicated BINGO GAME MODE Setup and Win Condition
  const createBingoRoomRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Bingo Host',
      hostAvatar: '🎯',
      targetWins: 1, // 1 Line to win
      deckSize: 9,
      gameMode: 'bingo',
      themeId: 'supermarket'
    }, resolve);
  });
  if (!createBingoRoomRes.success || createBingoRoomRes.room.gameMode !== 'bingo') {
    throw new Error('Bingo Game Mode room creation failed');
  }
  const bingoRoomCode = createBingoRoomRes.roomCode;
  const bingoP1Id = createBingoRoomRes.playerId;
  console.log(`✅ Dedicated Bingo Mode Room Created: ${bingoRoomCode} (GameMode: ${createBingoRoomRes.room.gameMode}, Target: ${createBingoRoomRes.room.targetWins} Line, DeckSize: ${createBingoRoomRes.room.prompts.length})`);

  // Join and start Bingo match
  const joinBingoRes = await new Promise((resolve) => {
    socket2.emit('join_room', {
      roomCode: bingoRoomCode,
      playerName: 'Bingo Challenger',
      playerAvatar: '🦁'
    }, resolve);
  });
  if (!joinBingoRes.success) throw new Error('Join bingo room failed');
  const bingoP2Id = joinBingoRes.playerId;

  const startBingoRes = await new Promise((resolve) => {
    socket1.emit('start_game', { roomCode: bingoRoomCode, playerId: bingoP1Id }, resolve);
  });
  if (!startBingoRes.success || startBingoRes.room.prompts.length !== 9) {
    throw new Error('Bingo match failed to start with exact 3x3 (9 items) grid');
  }
  console.log(`✅ Bingo Match Started with 3x3 (9 items) Grid! First to complete 1 line wins!`);

  // Simulate completing Row 1 (items 0, 1, 2)
  const bingoPrompts = startBingoRes.room.prompts;
  for (let i = 0; i < 3; i++) {
    const prompt = bingoPrompts[i];
    await new Promise((resolve) => {
      socket1.emit('submit_item', {
        roomCode: bingoRoomCode,
        playerId: bingoP1Id,
        promptId: prompt.id,
        photoUrl: `/uploads/bingo-item-${i}.jpg`,
        caption: `Bingo item #${i+1}`
      }, resolve);
    });

    const verifyRes = await new Promise((resolve) => {
      socket2.emit('verify_item', {
        roomCode: bingoRoomCode,
        reviewerId: bingoP2Id,
        targetPlayerId: bingoP1Id,
        promptId: prompt.id,
        approved: true,
        feedback: 'Row 1 find verified!'
      }, resolve);
    });

    if (i === 2) {
      if (verifyRes.room.status !== 'completed' || verifyRes.room.winner.id !== bingoP1Id) {
        throw new Error('Expected 1-line Bingo completion to trigger match win!');
      }
      console.log(`🏆 BINGO VICTORY TRIGGERED! Player 1 completed Row 1 (3-in-a-row) and won the match!`);
    }
  }

  socket1.disconnect();
  socket2.disconnect();
  console.log('🏆 ALL SCAVENGER HUNT TWISTS & THEMES PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

testGameFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
