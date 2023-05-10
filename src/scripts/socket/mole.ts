

const initMoleGame = () => {
	const mainGameContainer = document.querySelector('main');

	if (mainGameContainer) {
		mainGameContainer.className = 'started';
	}
};

socket.on('room:game:start', initMoleGame);