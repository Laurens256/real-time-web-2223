const initLobby = () => {
	const roomCode = window.location.pathname.split('/')[2];
	socket.emit('room:join', roomCode);

	socket.on('room:join:success', (room: string) => {
		console.log('Joined room: '+room);
	});
	
	socket.on('room:join:error', (error: string) => {
		console.log(error);
	});
	
	socket.on('room:message:system', (message: string) => {
		console.log(message);
	});

	initLobbyMsg();
};

const initLobbyMsg = () => {
	const msgContainer: HTMLUListElement | null = document.querySelector('.chat ul');
	const msgForm: HTMLFormElement | null = document.querySelector('.chat form');
	const msgInput: HTMLInputElement | null = document.querySelector('.chat form input');

	if (msgContainer && msgForm && msgInput) {
		msgForm.addEventListener('submit', (e) => {
			e.preventDefault();

			if (msgInput.value) {
				socket.emit('room:msg', msgInput.value);
				msgInput.value = '';
			}
		});

		socket.on('room:msg', (msg: string) => {
			msgContainer.appendChild(
				Object.assign(document.createElement('li'), { textContent: msg })
			);
			msgContainer.scrollTop = msgContainer.scrollHeight;
		});
	}
};