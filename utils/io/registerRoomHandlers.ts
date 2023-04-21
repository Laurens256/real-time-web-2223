import { roomExists, userJoin } from '../manageRooms.js';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const registerRoomHandlers = (io: any, socket: any) => {
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

		// save the current room and nickname to the socket
		socket.room = room;
		socket.nickname = nickname;

		if (roomExists(room)) {
			socket.join(room);

			userJoin(room, { id: socket.id, name: nickname });

			socket.broadcast
				.to(room)
				.emit(
					'room:message:system',
					`<nickname>${nickname}</nickname> has joined the room`
				);

			socket.emit('room:join:success', room);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});

	// send message to room
	socket.on('room:msg', (msg: string) => {
		const room = socket.room;
		const user = socket.nickname;

		io.to(room).emit('room:msg', { user, msg });
	});
};

export { registerRoomHandlers };
