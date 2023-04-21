import { roomExists, userLeave } from '../manageRooms.js';

const registerGeneralHandlers = (io: any, socket: any) => {
	socket.on('disconnect', () => {
		const room = socket.room;
		const user = socket.nickname;

		userLeave(room, socket.id);

		if (roomExists(room)) {
			io.to(room).emit(
				'room:message:system',
				`<nickname>${user}</nickname> has left the room`
			);
		}
	})
};

export { registerGeneralHandlers };
