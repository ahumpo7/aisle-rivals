import { io } from 'socket.io-client';

// Connect to the backend
// In dev Vite proxy handles /socket.io, or in production same origin
const socket = io(typeof window !== 'undefined' ? window.location.origin : '', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000
});

export default socket;
