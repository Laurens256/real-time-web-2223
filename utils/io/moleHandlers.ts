import { getRoomMembers, togglePlay } from '../manageRooms.js';

const moleHandlers = (io: any, socket: any) => {
	socket.on('room:game:start', (holes: number) => {
		const roomMembers = getRoomMembers(socket.room);

		// todo: niet vergeten dit uit te commenten of aan te passen
		// if (roomMembers.length > 1) {
			io.to(socket.room).emit('room:game:start', roomMembers);
			togglePlay(socket.room, true);
			game(holes, io, socket);
		// }
	});
};

const activeHoles: Set<number> = new Set();
const game = (holes: number, io: any, socket: any) => {
	// every intervalTime, a mole will appear
	const interval = setInterval(() => {
		// get a random hole
		const randomHole = Math.floor(Math.random() * holes);

		// if the hole is not active, activate it
		if (!activeHoles.has(randomHole)) {
			activeHoles.add(randomHole);
			io.to(socket.room).emit('room:mole:emerge', randomHole);
		}

		// if the hole is still active after 1000ms, deactivate it
		setTimeout(() => {
			if (activeHoles.has(randomHole)) {
				activeHoles.delete(randomHole);
				io.to(socket.room).emit('room:mole:whack', randomHole);
			}
		}, 1000);
	}, 1500);

	// after 60 seconds, stop the game
	setTimeout(() => {
		clearInterval(interval);
		io.to(socket.room).emit('room:game:stop');
		togglePlay(socket.room, false);
	}, 60000);
	
	// when a user whacks a mole, remove it from the active holes
	socket.on('room:mole:whack', (hole: number) => {
		console.log('whack');
		io.to(socket.room).emit('room:mole:whack', hole);
	
		if (activeHoles.has(hole)) {
			io.to(socket.id).emit('room:game:points');
		}
	
		activeHoles.delete(hole);
	});
};

export { moleHandlers };
