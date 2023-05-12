import { getRoomMembers, togglePlay } from '../manageRooms.js';

const moleHandlers = (io: any, socket: any) => {
	socket.on('room:game:start', (holes: number) => {
		const roomMembers = getRoomMembers(socket.room);

		roomMembers.forEach((member) => {
			userScores[member.name] = 0;
		});

		// todo: niet vergeten dit uit te commenten of aan te passen
		// if (roomMembers.length > 1) {
		io.to(socket.room).emit('room:game:start');
		togglePlay(socket.room, true);
		game(holes, io, socket);
		// }
	});

	// when a user whacks a mole, remove it from the active holes
	socket.on('room:mole:whack', (hole: number) => {
		io.to(socket.room).emit('room:mole:whack', hole, true);

		if (activeHoles.has(hole)) {
			userScores[socket.user]++;
			io.to(socket.room).emit('room:game:points', userScores);
			activeHoles.delete(hole);
		}
	});
};

let userScores: { [name: string]: number } = {};
let moleTimeout: ReturnType<typeof setTimeout>;
const spawnMoles = (
	holes: number,
	io: any,
	socket: any,
	delay = 1500 / getRoomMembers(socket.room).length
) => {
	if (delay < 300) {
		delay = 300;
	}
	moleTimeout = setTimeout(() => {
		// get a random hole
		const randomHole = Math.floor(Math.random() * holes);

		// if the hole is not active, activate it
		if (!activeHoles.has(randomHole)) {
			activeHoles.add(randomHole);
			io.to(socket.room).emit('room:mole:emerge', randomHole);
		}

		// if the hole is still active after n delay, deactivate it
		setTimeout(() => {
			if (activeHoles.has(randomHole)) {
				io.to(socket.room).emit('room:mole:whack', randomHole);
				
				// nested timeout so the mole can still be whacked as it's going down
				setTimeout(() => {
					activeHoles.delete(randomHole);
				}, 400);
			}
		}, 1000);

		// spawn another mole with a shorter delay
		spawnMoles(holes, io, socket, delay - 50);
	}, delay);
};

const activeHoles: Set<number> = new Set();
const game = (holes: number, io: any, socket: any) => {
	spawnMoles(holes, io, socket);

	// after n ms, stop the game
	setTimeout(() => {
		clearTimeout(moleTimeout);
		const sortedPoints = Object.entries(userScores).sort((a, b) => b[1] - a[1]);

		io.to(socket.room).emit('room:game:stop', sortedPoints);
		togglePlay(socket.room, false);

		userScores = {};
	}, 10000);
	// }, 40000);
};

export { moleHandlers };
