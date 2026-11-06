const { io } = require('./client/node_modules/socket.io-client');

async function testGameFlow() {
  console.log('🧪 Starting End-to-End Game Flow Simulation (Co-op Mode & Team Effort)...');

  const serverUrl = 'http://localhost:3000';

  const socket1 = io(serverUrl);
  const socket2 = io(serverUrl);

  await new Promise((resolve) => socket1.on('connect', resolve));
  await new Promise((resolve) => socket2.on('connect', resolve));
  console.log('✅ Both players connected via WebSocket');

  // Step 1: Create room in Co-Op mode
  const createRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Alex',
      hostAvatar: '🦊',
      targetWins: 5,
      deckSize: 20,
      gameMode: 'coop'
    }, resolve);
  });

  if (!createRes.success) throw new Error('Create room failed: ' + createRes.error);
  const roomCode = createRes.roomCode;
  const p1Id = createRes.playerId;
  console.log(`✅ Co-op Room created: ${roomCode} (GameMode: ${createRes.room.gameMode}, Team Goal: ${createRes.room.targetWins})`);

  if (createRes.room.gameMode !== 'coop') {
    throw new Error(`Expected gameMode 'coop', got ${createRes.room.gameMode}`);
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
  console.log(`✅ Player 2 (Sam) joined`);

  // Step 3: Start game
  const startRes = await new Promise((resolve) => {
    socket1.emit('start_game', { roomCode, playerId: p1Id }, resolve);
  });
  if (!startRes.success) throw new Error('Start game failed: ' + startRes.error);
  console.log(`✅ Co-Op Match started!`);

  const firstPrompt = startRes.room.prompts[0];

  // Step 4: Player 1 submits proof for the team
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
    photoUrl: '/uploads/sample-pickle-cotton-candy.jpg',
    caption: 'Found this weird item for our team goal!'
  });

  await alertPromise;

  // Step 5: Player 2 approves item for the team
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
    feedback: 'Awesome find for the team! Approved!'
  });

  const approvalResult = await approvalPromise;
  if (!approvalResult.approved || approvalResult.room.teamVerifiedCount !== 1) {
    throw new Error('Co-Op team score calculation failed');
  }
  console.log(`✅ Team verified count is now ${approvalResult.room.teamVerifiedCount}/${approvalResult.room.targetWins} (Team Score: ${approvalResult.room.teamScore} pts)`);

  socket1.disconnect();
  socket2.disconnect();
  console.log('🏆 CO-OP TEAM EFFORT E2E TEST PASSED PERFECTLY!');
  process.exit(0);
}

testGameFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
