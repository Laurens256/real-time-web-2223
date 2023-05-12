import { getRoomMembers, togglePlay } from '../manageRooms.js';

const moleHandlers = (io: any, socket: any) => {
	socket.on('room:game:start', (holes: number) => {
		const roomMembers = getRoomMembers(socket.room);

		userScores[socket.room] = {};
		roomMembers.forEach((member) => {
			userScores[socket.room][member.name] = 0;
		});

		io.to(socket.room).emit('room:game:start');
		togglePlay(socket.room, true);
		game(holes, io, socket);
		currentPlayers = roomMembers.length;
	});

	// when a user whacks a mole, remove it from the active holes
	socket.on('room:mole:whack', (hole: number) => {
		io.to(socket.room).emit('room:mole:whack', hole, true);

		if (activeHoles.has(hole)) {
			userScores[socket.room][socket.user]++;
			io.to(socket.room).emit('room:game:points', userScores);
			activeHoles.delete(hole);
		}
	});
};

let currentPlayers = 0;
let userScores: { [room: string]: { [name: string]: number } } = {};
let moleTimeout: ReturnType<typeof setTimeout>;
const spawnMoles = (holes: number, io: any, socket: any, delay = 1500) => {
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
				}, 300);
			}
		}, 1000);

		const delaySubtraction = Math.min(50 * (currentPlayers >= 2 ? 2 : 1), 150);
		const newDelay = delay - delaySubtraction > 300 ? delay - delaySubtraction : 300;
		// spawn another mole with a shorter delay
		spawnMoles(holes, io, socket, newDelay);
	}, delay);
};

const activeHoles: Set<number> = new Set();
const game = (holes: number, io: any, socket: any) => {
	spawnMoles(holes, io, socket);

	// after n ms, stop the game

	setTimeout(() => {
		clearTimeout(moleTimeout);
		togglePlay(socket.room, false);
		currentPlayers = 0;

		const sortedPoints = Object.entries(userScores[socket.room]).sort(
			(a, b) => b[1] - a[1]
		);

		io.to(socket.room).emit('room:game:stop', sortedPoints);

		userScores[socket.room] = {};
	}, 40000);
};

export { moleHandlers };
