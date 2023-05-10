import { getRoomMembers } from '../manageRooms.js';

const moleHandlers = (io: any, socket: any) => {
	socket.on('room:game:start', () => {
		const roomMembers = getRoomMembers(socket.room);

		// todo: niet vergeten dit op 1 te zetten
		if (roomMembers.length > 0) {
			io.to(socket.room).emit('room:game:start');
		}
	});
};

export { moleHandlers };
