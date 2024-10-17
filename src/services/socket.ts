import { io } from 'socket.io-client';

// const URL = 'http://localhost:3000';
const URL = 'https://e464-103-121-144-218.ngrok-free.app';

export const socket = io(URL, {
    // autoConnect: false
});
