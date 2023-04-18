import { createRoom, getCurrentUser, roomExists, userJoin } from '../manageRooms.js';

const registerRoomHandlers = (io: any, socket: any) => {
	// create room
	socket.on('room:create', () => {
		const room = createRoom();
		socket.join(room);

		socket.emit('room:create:success', room);
	});

	// join room
	socket.on('room:join', (room: string) => {
		if (roomExists(room)) {
			socket.join(room);

			userJoin(room, { id: socket.id, name: 'bertus' });

			socket.broadcast.to(room).emit('room:message:system', 'bertus has joined the room');

			socket.emit('room:join:success', room);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});

	// send message to room
	socket.on('room:msg', (msg: string) => {
		// TODO: dit normaal maken lol
		const room = Array.from(socket.rooms)[1] as string;
		
		const user = getCurrentUser(room, socket.id).name;
		console.log(user);


		io.to(room).emit("room:msg", {user, msg});
	});
};

export { registerRoomHandlers };
