const registerRoomHandlers = (io: any, socket: any) => {
	socket.on('room:create', () => {
		console.log('room:create');
	});

	socket.on('room:join', (room: string) => {
		console.log('socket', room);
		socket.join(room);
	});
};

export { registerRoomHandlers };