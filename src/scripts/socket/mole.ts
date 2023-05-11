const initMoleGame = (users: iUser[]) => {
	const mainGameContainer = document.querySelector('main');

	if (mainGameContainer) {
		// mainGameContainer.classList.remove('unstarted');
		// mainGameContainer.classList.add('started');

		mainGameContainer.className = 'started joined';
		// mainGameContainer.classList.add('joined');
	}
};

socket.on('room:game:start', (users: iUser[]) => {
	initMoleGame(users);
});


interface iUser {
	id: string;
	name: string;
	admin: boolean;
};