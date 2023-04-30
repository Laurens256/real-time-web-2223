import { roomExists, userJoin, userLeave, getRoomMembers } from '../manageRooms.js';
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

			const isAdmin = getRoomMembers(room).length === 0;

			userJoin(room, { id: socket.id, name: user, admin: isAdmin });

			if (isAdmin) {
				socket.emit('room:admin');
			}

			socket.broadcast
				.to(room)
				.emit('room:msg:system', `<nickname>${user}</nickname> has joined the room`);

			socket.emit('room:join:success', user);
			io.to(room).emit('room:update:users', getRoomMembers(room).length);
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

	socket.on('room:msg:gif', (gif: { src: string; alt: string, source: string }) => {
		io.to(room).emit('room:msg:gif', user, gif);
	});

	socket.on('disconnect', () => {
		userLeave(room, socket.id);

		io.to(room).emit('room:msg:system', `<nickname>${user}</nickname> has left the room`);
		io.to(room).emit('room:update:users', getRoomMembers(room).length);
	});
};

export { chatHandlers };
