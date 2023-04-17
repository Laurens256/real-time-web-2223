// import { io } from 'socket.io-client';

// const socket = io();

socket.on('test', (msg: string) => {
	console.log(msg);
});