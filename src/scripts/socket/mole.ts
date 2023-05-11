const mainGameContainer = document.querySelector('main')!;
const initMoleGame = () => {
	socket.on('room:join:success', (user: string, isPlaying: boolean) => {
		if (isPlaying) {
			mainGameContainer.className = 'started';
			startGame();
		}
	});

	socket.on('room:game:start', () => {
		mainGameContainer.className = 'started joined';

		startGame();
	});

	socket.on('room:game:stop', () => {
		mainGameContainer.className = 'unstarted';

		stopGame();
	});
};

const holes = document.querySelectorAll(
	'div.board > button'
) as NodeListOf<HTMLButtonElement>;

const startGame = () => {
	let points = 0;

	if (mainGameContainer?.classList.contains('joined')) {
		holes.forEach((hole) => {
			hole.addEventListener('click', whack);
		});
	}

	socket.on('room:mole:emerge', (hole: number) => {
		holes[hole].classList.add('mole');
	});

	socket.on('room:mole:whack', (hole: number) => {
		holes[hole].classList.remove('mole');
	});

	socket.on('room:game:points', () => {
		points++;
		console.log(points);
	});
};

const stopGame = () => {
	holes.forEach((hole) => {
		hole.removeEventListener('click', whack);
		hole.classList.remove('mole');
	});
};

const whack = (e: MouseEvent) => {
	const hole = e.currentTarget as HTMLButtonElement;

	if (hole.classList.contains('mole')) {
		const holeIndex = Number(hole.dataset.index);

		socket.emit('room:mole:whack', holeIndex);
	}
};
