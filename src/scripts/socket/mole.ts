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

	socket.on('room:game:stop', (userPoints: [string, number][]) => {
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

const generateResults = (userPoints: [string, number][]) => {
	const resultsDialog: HTMLDialogElement = document.querySelector('dialog.results')!;
	const resultsList = resultsDialog.querySelector('ul')!;
	resultsList.innerHTML = '';

	userPoints.forEach(([user, points], index) => {
		const listItem = document.createElement('li');
		listItem.textContent = `Plaats ${index+1}: ${user}: ${points} punten`;
		resultsList.appendChild(listItem);
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
