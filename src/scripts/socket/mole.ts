const initMoleGame = () => {
	const mainGameContainer = document.querySelector('main');

	if (mainGameContainer) {
		// mainGameContainer.classList.remove('unstarted');
		// mainGameContainer.classList.add('started');

		mainGameContainer.className = 'started joined';
		// mainGameContainer.classList.add('joined');
	}

	game();
};

const holes = document.querySelectorAll(
	'div.board > button'
) as NodeListOf<HTMLButtonElement>;

const game = () => {
	let points = 0;

	holes.forEach((hole) => {
		hole.addEventListener('click', whack);
	});

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

const whack = (e: MouseEvent) => {
	const hole = e.currentTarget as HTMLButtonElement;
	
	if (hole.classList.contains('mole')) {
		const holeIndex = Array.from(holes).indexOf(hole);
		socket.emit('room:mole:whack', holeIndex);
	}
};

socket.on('room:game:start', () => {
	initMoleGame();
});

interface iUser {
	id: string;
	name: string;
	admin: boolean;
}
