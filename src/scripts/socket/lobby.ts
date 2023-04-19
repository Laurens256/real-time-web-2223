const initLobby = () => {
	const roomCode = window.location.pathname.split('/')[2];
	socket.emit('room:join', { room: roomCode, nickname: setNickname() });

	socket.on('room:join:success', (room: string) => {
		console.log('Joined room: ' + room);
	});

	socket.on('room:join:error', (error: string) => {
		console.log(error);
	});

	socket.on('room:message:system', (message: string) => {
		console.log(message);
	});

	setNickname();
	initLobbyMsg();
};

const setNickname = () => {
	const nickname = sessionStorage.getItem('nickname') || '';
	sessionStorage.removeItem('nickname');
	return nickname;
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

		socket.on('room:msg', (messageObj: { user: string; msg: string }) => {
			const { user, msg } = messageObj;
			msgContainer.appendChild(
				Object.assign(document.createElement('li'), { textContent: user + ': ' + msg })
			);
			msgContainer.scrollTop = msgContainer.scrollHeight;
		});
	}
};
