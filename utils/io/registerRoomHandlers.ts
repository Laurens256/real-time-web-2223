import { createRoom, roomExists } from '../manageRooms.js';

const registerRoomHandlers = (io: any, socket: any) => {
	socket.on('room:create', () => {
		const room = createRoom();
		socket.join(room);

		socket.emit('room:create:success', room);
	});

	socket.on('room:join', (room: string) => {
		if (roomExists(room)) {
			socket.join(room);

			socket.broadcast.to(room).emit('room:message:system', 'A user has joined the room');

			socket.emit('room:join:success', room);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});
};

export { registerRoomHandlers };
