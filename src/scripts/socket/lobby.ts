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

interface iMsgObj {
	user: string;
	msg: string;
}
const msgContainer: HTMLUListElement | null = document.querySelector('.chat ul');
const msgForm: HTMLFormElement | null = document.querySelector('.chat form');
const msgInput: HTMLInputElement | null = document.querySelector('.chat form input');
const initLobbyMsg = () => {
	if (msgContainer && msgForm && msgInput) {
		msgForm.addEventListener('submit', (e) => {
			e.preventDefault();

			if (msgInput.value) {
				socket.emit('room:msg', msgInput.value);
				msgInput.value = '';
			}
		});

		socket.on('room:msg', (messageObj: iMsgObj) => {
			createUserMessage(messageObj);
		});

		socket.on('room:message:system', (messageObj: iMsgObj) => {
			createSystemMessage(messageObj);
		});
	}
};

const createUserMessage = (messageObj: iMsgObj, classNames: string = '') => {
	const { user, msg } = messageObj;

	const li = document.createElement('li');
	const strong = document.createElement('strong');
	const span = document.createElement('span');

	strong.textContent = `${user}: `;
	span.textContent = msg;

	li.appendChild(strong);
	li.appendChild(span);
	li.className = classNames;
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

const createSystemMessage = (messageObj: iMsgObj) => {
	const { user, msg } = messageObj;

	const li = document.createElement('li');
	const strong = document.createElement('strong');
	const em = document.createElement('em');
	const span = document.createElement('span');

	strong.textContent = 'System: ';
	em.textContent = user;
	span.textContent = msg;

	li.appendChild(strong);
	li.appendChild(em);
	li.appendChild(span);

	li.classList.add('system');
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};
