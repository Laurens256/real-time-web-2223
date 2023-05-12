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
		} else {
			setTimeout(() => {
				holes[hole].classList.remove('whackable');
				holes[hole].classList.add('inactive');

				setTimeout(() => {
					holes[hole].classList.remove('inactive');
				}, 150);
			}, 500);
		}

		setTimeout(() => {
			holes[hole].classList.remove('mole');
		}, 300);
	});
};

const stopGame = () => {
	mainGameContainer.className = 'unstarted';
	holes.forEach((hole) => {
		hole.removeEventListener('click', whack);
		hole.classList.remove('mole', 'whackable', 'inactive');
	});
};

const generateResults = (userPoints: [string, number][]) => {
	const resultsDialog: HTMLDialogElement = document.querySelector('dialog.results')!;
	const resultsList = resultsDialog.querySelector('ol')!;
	resultsList.innerHTML = '';

	userPoints.forEach(([user, points]) => {
		const listItem = document.createElement('li');
		const userEl = document.createElement('strong');
		const pointsEl = document.createElement('em');
		const molesEl = document.createTextNode(points === 1 ? ' mole' : ' moles');

		userEl.classList.add('user');
		pointsEl.classList.add('points');

		userEl.textContent = `${user}: `;
		pointsEl.textContent = points.toString();

		listItem.appendChild(userEl);
		listItem.appendChild(pointsEl);
		listItem.appendChild(molesEl);

		resultsList.appendChild(listItem);
	});

	resultsDialog.show();
};

const whack = (e: MouseEvent) => {
	const hole = e.currentTarget as HTMLButtonElement;

	if (hole.classList.contains('whackable')) {
		const holeIndex = Number(hole.dataset.index);

		socket.emit('room:mole:whack', holeIndex);
	}
};
