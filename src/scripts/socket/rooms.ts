const homeView = () => {
	const createRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/create"]'
	);

	const joinRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/join"]'
	);
	const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

	const init = () => {
		createRoomForm?.addEventListener('submit', createRoom);
		joinRoomForm?.addEventListener('submit', joinRoom);
	};

	const createRoom = (e: SubmitEvent) => {
		e.preventDefault();
		socket.emit('room:create');
	};

	const joinRoom = (e: SubmitEvent) => {
		e.preventDefault();
		window.location.href = `/rooms/${joinRoomInput?.value}`;
	};

	socket.on('room:create:success', (room: string) => {
		window.location.href = `/rooms/${room}`;
	});

	init();
};

const roomView = () => {
	const init = () => {
		const roomCode = window.location.pathname.split('/')[2];
		socket.emit('room:join', roomCode);
	};

	socket.on('room:join:success', (room: string) => {
		console.log(room);
	});

	socket.on('room:join:error', (error: string) => {
		console.log(error);
	});

	socket.on('room:message:system', (message: string) => {
		console.log(message);
	});

	init();
};

// regex that matches for /rooms/ + id with length of 6 containing only letters and numbers
const roomRegex = /^\/rooms\/[a-zA-Z0-9]{6}$/;
(() => {
	const path = window.location.pathname;
	if (path === '/') {
		homeView();
	} else if (roomRegex.test(path)) {
		roomView();
	}
})();
