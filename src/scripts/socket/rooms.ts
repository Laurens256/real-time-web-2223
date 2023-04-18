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
		const roomId = joinRoomInput?.value;

		if (roomId) {
			socket.emit('room:join', roomId);
		}
	};

	socket.on('room:join:success', (room: any) => {
		window.location.href = `/rooms/${room.id}`;
	});

	socket.on('room:join:error', (error: string) => {
		console.log(error);
	});

	socket.on('test', (message: string) => {
		console.log(message);
	});

	socket.on('test2', (message: string) => {
		console.log(message);
	});

	init();
};

const roomView = () => {
	const button = document.querySelector('button') as HTMLButtonElement;
	button.addEventListener('click', () => {
		socket.emit('test', 'Hello from client');
	});

	socket.on('test', (message: string) => {
		console.log(message);
	});

	socket.on('test2', (message: string) => {
		console.log(message);
	});

	socket.on('test3', (message: string) => {
		console.log('clicked');
	});
};

// regex that matches for /rooms/ + id with length of 6 containing only letters and numbers
const roomRegex = /^\/rooms\/[a-zA-Z0-9]{6}$/;
(() => {
	const path = window.location.pathname;
	if (path === '/') {
		homeView();
	} else if (path === '/rooms') {
		roomView();
	} else if (roomRegex.test(path)) {
		roomView();
	}
})();
