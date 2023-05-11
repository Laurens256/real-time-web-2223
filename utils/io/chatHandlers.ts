import { roomExists, userJoin, userLeave, getRoomMembers, getRoomAdmin } from '../manageRooms.js';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { getCurrentTyping } from './ioUtils/currentlyTyping.js';

const chatHandlers = (io: any, socket: any) => {
	socket.on('room:join', (data: { room: string; nickname: string }) => {
		// save the current room and nickname to the socket
		socket.room = data.room;
		socket.user =
			data.nickname ||
			uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				length: 2,
				style: 'capital',
				separator: ' '
			});

		if (roomExists(socket.room)) {
			socket.join(socket.room);

			const isAdmin = getRoomMembers(socket.room).length === 0;

			userJoin(socket.room, { id: socket.id, name: socket.user, admin: isAdmin });

			if (isAdmin) {
				io.to(socket.id).emit('room:admin');
			}

			socket.broadcast
				.to(socket.room)
				.emit(
					'room:msg:system',
					`<nickname>${socket.user}</nickname> has joined the room`
				);

			socket.emit('room:join:success', socket.user);
			io.to(socket.room).emit('room:update:users', getRoomMembers(socket.room).length);
		} else {
			socket.emit('room:join:error', 'Room does not exist');
		}
	});

	socket.on('room:typing:start', () => {
		socket.broadcast
			.to(socket.room)
			.emit('room:typing', getCurrentTyping(socket.room, socket.user, 'add'));
	});

	socket.on('room:typing:stop', () => {
		socket.broadcast
			.to(socket.room)
			.emit('room:typing', getCurrentTyping(socket.room, socket.user, 'remove'));
	});

	socket.on('room:msg', (msg: string) => {
		io.to(socket.room).emit('room:msg', { user: socket.user, msg });
	});

	socket.on('room:msg:gif', (gif: { src: string; alt: string; source: string }) => {
		io.to(socket.room).emit('room:msg:gif', socket.user, gif);
	});

	socket.on('disconnect', () => {
		
		// check if a new admin can be made when current admin leaves
		if (socket.id === getRoomAdmin(socket.room)) {
			const newAdmin = getRoomMembers(socket.room)[1];
			if (newAdmin) {
				io.to(newAdmin.id).emit('room:admin');
			}
		}
		userLeave(socket.room, socket.id);

		io.to(socket.room).emit(
			'room:msg:system',
			`<nickname>${socket.user}</nickname> has left the room`
		);
		io.to(socket.room).emit('room:update:users', getRoomMembers(socket.room).length);
	});
};

export { chatHandlers };
