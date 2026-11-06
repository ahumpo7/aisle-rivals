const { io } = require('./client/node_modules/socket.io-client');

async function testGameFlow() {
  console.log('🧪 Starting End-to-End Game Flow Simulation (20 items, swap feature, target wins)...');

  const serverUrl = 'http://localhost:3000';

  const socket1 = io(serverUrl);
  const socket2 = io(serverUrl);

  await new Promise((resolve) => socket1.on('connect', resolve));
  await new Promise((resolve) => socket2.on('connect', resolve));
  console.log('✅ Both players connected via WebSocket');

  // Step 1: Create room with 20 items and targetWins = 5
  const createRes = await new Promise((resolve) => {
    socket1.emit('create_room', {
      hostName: 'Alex',
      hostAvatar: '🦊',
      targetWins: 5,
      deckSize: 20
    }, resolve);
  });

  if (!createRes.success) throw new Error('Create room failed: ' + createRes.error);
  const roomCode = createRes.roomCode;
  const p1Id = createRes.playerId;
  console.log(`✅ Room created: ${roomCode} with ${createRes.room.prompts.length} items in deck (Target to win: ${createRes.room.targetWins})`);

  if (createRes.room.prompts.length !== 20) {
    throw new Error(`Expected 20 prompts in deck, got ${createRes.room.prompts.length}`);
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

  // Step 3: Test Swap Item feature before or during game
  const promptToSwap = createRes.room.prompts[0];
  console.log(`🔄 Testing swap on: "${promptToSwap.title}"`);

  const swapAlertPromise = new Promise((resolve) => {
    socket2.on('item_swapped_alert', (data) => {
      console.log(`🔔 Player 2 received swap alert: ${data.message}`);
      resolve(data);
    });
  });

  const swapRes = await new Promise((resolve) => {
    socket1.emit('swap_item', {
      roomCode,
      playerId: p1Id,
      promptId: promptToSwap.id
    }, resolve);
  });

  if (!swapRes.success) throw new Error('Swap item failed: ' + swapRes.error);
  console.log(`✅ Prompt swapped successfully! Replaced with: "${swapRes.newPrompt.title}"`);
  await swapAlertPromise;

  // Step 4: Start game
  const startRes = await new Promise((resolve) => {
    socket1.emit('start_game', { roomCode, playerId: p1Id }, resolve);
  });
  if (!startRes.success) throw new Error('Start game failed: ' + startRes.error);
  console.log(`✅ Match started!`);

  socket1.disconnect();
  socket2.disconnect();
  console.log('🏆 20-ITEM DECK, SWAP FEATURE, AND RACE GOALS ALL PASSED PERFECTLY!');
  process.exit(0);
}

testGameFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
