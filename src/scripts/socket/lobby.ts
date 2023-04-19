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

		socket.on('room:message:system', (message: string) => {
			createSystemMessage(message);
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

const createSystemMessage = (content: string) => {
	const li = document.createElement('li');
	const strong = document.createElement('strong');

	// message is a document fragment containing the message in a <span> tag, if a nickname is found it's in an <em> tag
	const message = findName(content);
	strong.textContent = 'System: ';

	li.appendChild(strong);
	li.appendChild(message);

	li.classList.add('system');
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

// finds my custom <nickname> tag and returns a fragment with the nickname in an <em> tag and the rest of the message in a <span> tag, this way innerHTML doesn't have to be used so it's more secure
const findName = (str: string) => {
	const regex = /<nickname>(.*?)<\/nickname>/g;
	const matches = str.match(regex);
	const fragment = document.createDocumentFragment();

	if (matches) {
		const em = document.createElement('em');
		em.textContent = matches[0].replace(/<\/?nickname>/g, '');
		fragment.appendChild(em);
	}

	const span = document.createElement('span');
	span.textContent = str.replace(regex, '');
	fragment.appendChild(span);

	return fragment;
};
