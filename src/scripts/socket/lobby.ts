let nickName = '';
const initLobby = () => {
	const roomCode = window.location.pathname.split('/')[2];
	socket.emit('room:join', { room: roomCode, nickname: setNickname() });

	socket.on('room:join:success', (room: string, user: string) => {
		console.log('Joined room: ' + room);
		nickName = user;
	});

	socket.on('room:join:error', (error: string) => {
		// console.log(error);
	});

	socket.on('room:message:system', (message: string) => {
		// console.log(message);
	});

	setNickname();
	initLobbyMsg();
};

const setNickname = () => {
	const tempNickname = sessionStorage.getItem('nickname') || '';
	return tempNickname;
};

interface iMsgObj {
	user: string;
	msg: string;
}

const msgContainer: HTMLUListElement | null = document.querySelector('.chat ul');
const msgForm: HTMLFormElement | null = document.querySelector('.chat form');
const msgInput: HTMLInputElement | null = document.querySelector('.chat form input');

// ... is typing message
const isTypingUsers: HTMLElement | null = document.querySelector('.chat > small strong');
const isTypingMessage: HTMLElement | null = document.querySelector('.chat > small span');
const initLobbyMsg = () => {
	if (msgContainer && msgForm && msgInput && isTypingUsers && isTypingMessage) {
		msgForm.addEventListener('submit', (e) => {
			e.preventDefault();

			if (msgInput.value) {
				socket.emit('room:msg', msgInput.value);
				msgInput.value = '';
			}
		});

		msgInput.addEventListener('keypress', () => {
			socket.emit('room:typing:start');
		});

		socket.on('room:typing', (users: string[]) => {
			createIsTypingMessage(users);
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

	// message is a <span> tag containing any found nicknames inside an <em> tag
	const message = findName(content);
	strong.textContent = 'System: ';

	li.appendChild(strong);
	li.appendChild(message);

	li.classList.add('system');
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

// finds my custom <nickname> tag and returns a span with the message, if my custom tag is found, it's placed into an <em> tag and inserted into  the right place in the string
const findName = (str: string) => {
	const regex = /<nickname>(.*?)<\/nickname>/g;
	const matches = str.match(regex);

	const span = document.createElement('span');

	if (matches) {
		matches.forEach((match, i) => {
			const index = str.indexOf(match);

			// add text before the match to a textnode
			const textNode = document.createTextNode(str.substring(0, index));

			// add match to an em tag
			const em = document.createElement('em');
			em.textContent = match.replace(/<\/?nickname>/g, '');

			span.append(textNode, em);

			// add text after the last match to a textnode
			if (i + 1 === matches.length) {
				const textNodeAfter = document.createTextNode(
					str.substring(index + match.length)
				);
				span.appendChild(textNodeAfter);
			}

			// remove the match from the string so it doesn't get used again in the next iteration
			str = str.replace(match, '');
		});
	} else {
		span.textContent = str;
	}

	return span;
};

const checkIfTyping = () => {};

const createIsTypingMessage = (users: string[]) => {
	let usersString = '';
	users = users.filter((user) => user !== nickName);
	console.log(users, nickName);

	if (users.length > 1) {
		usersString = 'Several people';
	} else {
		usersString = `${users.join(', ')}`;
	}

	isTypingUsers!.textContent = usersString;
	isTypingMessage!.textContent = users.length > 1 ? ' are typing...' : ' is typing...';
};
