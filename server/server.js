const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const QRCode = require('qrcode');
const gameManager = require('./gameManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e7 // 10MB
});

const PORT = process.env.PORT || 3000;
let publicTunnelUrl = null;

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for camera photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `hunt-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper to get local Wi-Fi / LAN IP addresses
function getLocalNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ name, address: iface.address });
      }
    }
  }
  return addresses;
}

// Dynamically determine the best base URL (Render Cloud URL, Public Tunnel, or Local LAN IP)
function getEffectiveBaseUrl(req) {
  if (publicTunnelUrl) return publicTunnelUrl;
  
  // Check if hosted on Render, Railway, or behind reverse proxy
  const forwardedProto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host');
  if (host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    return `${forwardedProto}://${host}`;
  }

  const addresses = getLocalNetworkAddresses();
  const primaryIp = addresses.length > 0 ? addresses[0].address : 'localhost';
  return `http://${primaryIp}:${PORT}`;
}

// API: Get server network info (including public tunnel if active) and QR code
app.get('/api/network-info', async (req, res) => {
  const addresses = getLocalNetworkAddresses();
  const primaryIp = addresses.length > 0 ? addresses[0].address : 'localhost';
  const effectiveUrl = getEffectiveBaseUrl(req);
  const qrDataUrl = await QRCode.toDataURL(effectiveUrl, {
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  res.json({
    primaryIp,
    port: PORT,
    serverUrl: effectiveUrl,
    publicTunnelUrl,
    addresses,
    qrDataUrl
  });
});

// API: Generate QR code for a specific room join link
app.get('/api/room-qr/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const baseUrl = getEffectiveBaseUrl(req);
    const joinUrl = `${baseUrl}/?room=${roomCode.toUpperCase()}`;
    const qrDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    res.json({ joinUrl, qrDataUrl, publicTunnelUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// API: Photo Upload Endpoint (Multipart or Base64)
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, url: fileUrl });
  }

  // Fallback if sent as JSON base64
  if (req.body && req.body.imageBase64) {
    const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const filename = `hunt-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save base64 image' });
      }
      return res.json({ success: true, url: `/uploads/${filename}` });
    });
    return;
  }

  res.status(400).json({ error: 'No image file uploaded' });
});

// Socket.io Realtime Events
io.on('connection', (socket) => {
  // Create Room
  socket.on('create_room', ({ hostName, hostAvatar, targetWins, deckSize }, callback) => {
    try {
      const result = gameManager.createRoom(hostName, hostAvatar, targetWins || 8, deckSize || 20);
      socket.join(result.roomCode);
      gameManager.setPlayerSocket(result.roomCode, result.playerId, socket.id);
      socket.roomCode = result.roomCode;
      socket.playerId = result.playerId;

      if (callback) callback({ success: true, ...result });
    } catch (err) {
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // Join Room
  socket.on('join_room', ({ roomCode, playerName, playerAvatar }, callback) => {
    try {
      const result = gameManager.joinRoom(roomCode, playerName, playerAvatar);
      if (result.error) {
        if (callback) callback({ success: false, error: result.error });
        return;
      }

      socket.join(result.roomCode);
      gameManager.setPlayerSocket(result.roomCode, result.playerId, socket.id);
      socket.roomCode = result.roomCode;
      socket.playerId = result.playerId;

      io.to(result.roomCode).emit('room_updated', result.room);
      if (callback) callback({ success: true, ...result });
    } catch (err) {
      if (callback) callback({ success: false, error: err.message });
    }
  });

  // Reconnect / Sync State
  socket.on('reconnect_player', ({ roomCode, playerId }, callback) => {
    const room = gameManager.getRoom(roomCode);
    if (!room || !room.players[playerId]) {
      if (callback) callback({ success: false, error: 'Session expired or not found' });
      return;
    }

    socket.join(roomCode.toUpperCase());
    gameManager.setPlayerSocket(roomCode, playerId, socket.id);
    socket.roomCode = roomCode.toUpperCase();
    socket.playerId = playerId;

    if (callback) callback({ success: true, room });
    io.to(roomCode.toUpperCase()).emit('room_updated', room);
  });

  // Start Game
  socket.on('start_game', ({ roomCode, playerId }, callback) => {
    const result = gameManager.startGame(roomCode, playerId);
    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }

    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);
    io.to(roomCode.toUpperCase()).emit('game_started_alert', {
      message: `Scavenger Hunt is on! 20 items in play — first to ${result.room.targetWins} wins!`
    });
    if (callback) callback({ success: true, room: result.room });
  });

  // Swap / Replace Item (if players don't like it)
  socket.on('swap_item', ({ roomCode, playerId, promptId }, callback) => {
    const result = gameManager.swapPrompt(roomCode, playerId, promptId);
    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }

    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);
    io.to(roomCode.toUpperCase()).emit('item_swapped_alert', {
      message: `🔄 Challenge "${result.oldPrompt.title}" was swapped for "${result.newPrompt.title}"!`
    });
    if (callback) callback({ success: true, room: result.room, newPrompt: result.newPrompt });
  });

  // Submit Item Proof
  socket.on('submit_item', ({ roomCode, playerId, promptId, photoUrl, caption }, callback) => {
    const result = gameManager.submitItemProof(roomCode, playerId, promptId, photoUrl, caption);
    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }

    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);

    socket.to(roomCode.toUpperCase()).emit('partner_item_submitted', {
      playerId,
      playerName: result.room.players[playerId].name,
      promptTitle: result.prompt.title,
      promptIcon: result.prompt.icon,
      submission: result.submission,
      message: `${result.room.players[playerId].name} found "${result.prompt.title}"! Tap to inspect and verify!`
    });

    if (callback) callback({ success: true, room: result.room });
  });

  // Verify Item Proof (Approve / Reject)
  socket.on('verify_item', ({ roomCode, reviewerId, targetPlayerId, promptId, approved, feedback }, callback) => {
    const result = gameManager.verifyItemProof(
      roomCode,
      reviewerId,
      targetPlayerId,
      promptId,
      approved,
      feedback
    );

    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }

    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);

    io.to(roomCode.toUpperCase()).emit('item_verification_result', {
      reviewerName: result.reviewer.name,
      targetPlayerName: result.targetPlayer.name,
      targetPlayerId,
      promptId,
      approved,
      feedback,
      points: approved ? result.submission.pointsEarned : 0,
      title: result.submission.promptTitle
    });

    if (result.room.status === 'completed') {
      io.to(roomCode.toUpperCase()).emit('game_completed', {
        winner: result.room.winner,
        room: result.room
      });
    }

    if (callback) callback({ success: true, room: result.room });
  });

  // Floating Emoji Reaction
  socket.on('send_reaction', ({ roomCode, senderId, emoji }) => {
    const reaction = gameManager.addReaction(roomCode, senderId, emoji);
    if (reaction) {
      io.to(roomCode.toUpperCase()).emit('live_reaction', reaction);
    }
  });

  // Add Custom Prompt
  socket.on('add_custom_prompt', ({ roomCode, playerId, promptData }, callback) => {
    const result = gameManager.addCustomPrompt(roomCode, playerId, promptData);
    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }
    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);
    if (callback) callback({ success: true, room: result.room });
  });

  // Reset Game
  socket.on('reset_game', ({ roomCode }, callback) => {
    const result = gameManager.resetGame(roomCode);
    if (result.error) {
      if (callback) callback({ success: false, error: result.error });
      return;
    }
    io.to(roomCode.toUpperCase()).emit('room_updated', result.room);
    if (callback) callback({ success: true, room: result.room });
  });
});

// Serve frontend build if present
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

server.listen(PORT, '0.0.0.0', async () => {
  const addresses = getLocalNetworkAddresses();
  console.log(`=======================================================`);
  console.log(`🛒 COUPLE'S STORE SCAVENGER HUNT SERVER RUNNING!`);
  console.log(`Local machine:    http://localhost:${PORT}`);
  addresses.forEach((addr) => {
    console.log(`Wi-Fi / Phone URL: http://${addr.address}:${PORT} (${addr.name})`);
  });

  // Automatically start secure public tunnel for anywhere cellular/store access
  if (process.env.NO_TUNNEL !== 'true') {
    try {
      console.log(`🌐 Opening public Cloudflare tunnel for anywhere phone access...`);
      const { startTunnel } = require('untun');
      const tunnel = await startTunnel({ port: PORT });
      publicTunnelUrl = await tunnel.getURL();
      console.log(`✨ PUBLIC ANYWHERE URL: ${publicTunnelUrl}`);
      console.log(`📲 Scan or open on your phones anywhere on 5G/LTE or Store Wi-Fi!`);
    } catch (err) {
      console.log(`ℹ️ Tunnel notice: Running local-network mode (${err.message})`);
    }
  }
  console.log(`=======================================================`);
});
