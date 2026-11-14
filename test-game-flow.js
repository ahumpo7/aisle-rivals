process.env.NO_TUNNEL = 'true';
const { io } = require('./client/node_modules/socket.io-client');
const http = require('http');

async function testGameFlow() {
  console.log('🧪 Starting End-to-End Game Flow Simulation (Multi-Theme & Co-Op Support)...');

  // Start the actual server in-process if not already listening
  const serverModule = require('./server/server');

  // Wait a moment for server to bind
  await new Promise((r) => setTimeout(r, 600));

  const serverUrl = 'http://localhost:3000';

  const socket1 = io(serverUrl);
  const socket2 = io(serverUrl);

  await new Promise((resolve) => socket1.on('connect', resolve));
  await new Promise((resolve) => socket2.on('connect', resolve));
  console.log('✅ Both players connected via WebSocket');

  // Test all themes are available via API
  const httpRes = await fetch('http://localhost:3000/api/themes');
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

  socket1.disconnect();
  socket2.disconnect();
  console.log('🏆 MULTI-THEME & CO-OP E2E TEST PASSED PERFECTLY!');
  process.exit(0);
}

testGameFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
