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

	socket.on('room:game:stop', (userPoints: { [name: string]: number }) => {
		stopGame();
		generateResults(userPoints);
	});
};

const holes = document.querySelectorAll(
	'div.board > button'
) as NodeListOf<HTMLButtonElement>;

const startGame = () => {
	if (mainGameContainer?.classList.contains('joined')) {
		holes.forEach((hole) => {
			hole.addEventListener('click', whack);
		});
	}

	socket.on('room:mole:emerge', (hole: number) => {
		holes[hole].classList.add('mole', 'whackable');
	});


	socket.on('room:mole:whack', (hole: number, userWhacked = false) => {
		if (userWhacked) {
			holes[hole].classList.remove('whackable');
		}

		setTimeout(() => {
			holes[hole].classList.remove('mole');

			setTimeout(() => {
				holes[hole].classList.remove('whackable');
			}, 300);

		}, 400);
	});
};

const stopGame = () => {
	mainGameContainer.className = 'unstarted';
	holes.forEach((hole) => {
		hole.removeEventListener('click', whack);
		hole.classList.remove('mole', 'whackable');
	});
};

const generateResults = (userPoints: { [name: string]: number }) => {
	const resultsDialog: HTMLDialogElement = document.querySelector('dialog.results')!;
	const resultsList = resultsDialog.querySelector('ul')!;
	resultsList.innerHTML = '';

	// sort the user points by highest score
	const sortedUserPoints = Object.entries(userPoints).sort((a, b) => b[1] - a[1]);

	Object.entries(sortedUserPoints).forEach(([name, points]) => {
		const li = document.createElement('li');
		li.textContent = `${name}: ${points}`;
		resultsList.appendChild(li);
	});

	resultsDialog.showModal();
};

const whack = (e: MouseEvent) => {
	const hole = e.currentTarget as HTMLButtonElement;

	if (hole.classList.contains('mole') && hole.classList.contains('whackable')) {
		const holeIndex = Number(hole.dataset.index);

		socket.emit('room:mole:whack', holeIndex);
	}
};
