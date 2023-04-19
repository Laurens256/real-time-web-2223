import { createRoom, getCurrentUser, roomExists, userJoin } from '../manageRooms.js';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const registerRoomHandlers = (io: any, socket: any) => {
	// create room
	socket.on('room:create', () => {
		const room = createRoom();
		socket.emit('room:create:success', room);
	});

	// join room
	socket.on('room:join', (data: { room: string; nickname: string }) => {
		const room = data.room;
		const nickname =
			data.nickname ||
			uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				length: 2,
				style: 'capital',
				separator: ' '
			});

		if (roomExists(room)) {
			socket.join(room);

			userJoin(room, { id: socket.id, name: nickname });

			socket.broadcast
				.to(room)
				.emit('room:message:system', `<nickname>${nickname}</nickname> has joined the room`);

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

		io.to(room).emit('room:msg', { user, msg });
	});
};

export { registerRoomHandlers };
