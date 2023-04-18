const homeView = () => {
	const createRoomForm: HTMLFormElement | null = document.querySelector('form[action="/rooms/create"]');

	const joinRoomForm: HTMLFormElement | null = document.querySelector('form[action="/rooms/join"]');
	const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

	const init = () => {
		createRoomForm?.addEventListener('submit', createRoom);
		joinRoomForm?.addEventListener('submit', joinRoom);
	};

	const createRoom = (e: SubmitEvent) => {
		e.preventDefault();
		socket.emit('room:create');
	}

	const joinRoom = (e: SubmitEvent) => {
		e.preventDefault();
		const roomId = joinRoomInput?.value;

		if (roomId) {
			socket.emit('room:join', roomId);
		}
	};

	socket.on('room:create', (room: string) => {
		window.location.href = `/rooms/${room}`;
	});

	socket.on('room:join:success', (room: string) => {
		window.location.href = `/rooms/${room}`;
	});

	socket.on('room:join:error', (error: string) => {
		console.log(error);
	});

	init();
};

const roomView = () => {};

(() => {
	const path = window.location.pathname;
	console.log(path);
	if (path === '/') {
		homeView();
	} else if (path === '/rooms') {
		roomView();
	}
})();
