import { roomExists, userJoin, userLeave } from '../manageRooms.js';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { getCurrentTyping } from './ioUtils/currentlyTyping.js';

const chatHandlers = (io: any, socket: any) => {
	let room = '';
	let user = '';

	socket.on('room:join', (data: { room: string; nickname: string }) => {
		room = data.room;
		user =
			data.nickname ||
			uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				length: 2,
				style: 'capital',
				separator: ' '
			});

		// save the current room and nickname to the socket
		socket.room = room;
		socket.user = user;

		if (roomExists(room)) {
			socket.join(room);

			userJoin(room, { id: socket.id, name: user });

			socket.broadcast
				.to(room)
				.emit('room:message:system', `<nickname>${user}</nickname> has joined the room`);

			socket.emit('room:join:success', room, user);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});

	socket.on('room:typing:start', () => {
		socket.broadcast.to(room).emit('room:typing', getCurrentTyping(room, user, 'add'));
	});

	socket.on('room:typing:stop', () => {
		socket.broadcast.to(room).emit('room:typing', getCurrentTyping(room, user, 'remove'));
	});

	socket.on('room:msg', (msg: string) => {
		io.to(room).emit('room:msg', { user, msg });
	});

	socket.on('disconnect', () => {
		userLeave(room, socket.id);

		io.to(room).emit(
			'room:message:system',
			`<nickname>${user}</nickname> has left the room`
		);
	});
};

export { chatHandlers };
