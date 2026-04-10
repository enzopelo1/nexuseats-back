import { io, Socket } from 'socket.io-client';
import type { AuthTokens } from '@/types';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const tokens = localStorage.getItem('tokens');
    const accessToken = tokens ? (JSON.parse(tokens) as AuthTokens).accessToken : '';

    socket = io(import.meta.env.VITE_WS_URL || '/', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
