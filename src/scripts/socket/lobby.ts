let nickName = '';
const initLobby = () => {
	const roomCode = window.location.pathname.split('/')[2];
	socket.emit('room:join', { room: roomCode, nickname: setNickname() });

	socket.on('room:join:success', (user: string) => {
		nickName = user;
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
const msgForm: HTMLFormElement | null = document.querySelector('.chat form[action="/"]');
const msgInput: HTMLInputElement | null = document.querySelector(
	'.chat form[action="/"] input'
);

// ... is typing message
const isTypingUsers: HTMLElement | null = document.querySelector('.chat > small strong');
const isTypingMessage: HTMLElement | null = document.querySelector('.chat > small span');
const initLobbyMsg = () => {
	if (msgContainer && msgForm && msgInput && isTypingUsers && isTypingMessage) {
		msgForm.addEventListener('submit', (e) => {
			e.preventDefault();

			if (msgInput.value) {
				socket.emit('room:msg', msgInput.value);
				socket.emit('room:typing:stop');
				msgInput.value = '';
			}
		});

		msgInput.addEventListener('input', () => {
			checkIfTyping(socket);
		});

		socket.on('room:typing', (users: string[]) => {
			createIsTypingMessage(users);
		});

		socket.on('room:msg', (messageObj: iMsgObj) => {
			createUserMessage(messageObj);
		});

		socket.on('room:msg:system', (message: string) => {
			createSystemMessage(message);
		});

		socket.on(
			'room:msg:gif',
			(user: string, gif: { src: string; alt: string; source: string }) => {
				createGifMessage(user, gif);
			}
		);
	}
};

const createGifMessage = (
	user: string,
	gif: { src: string; alt: string; source: string }
) => {
	const li = document.createElement('li');
	const img = document.createElement('img');

	if (gif.source) {
		img.addEventListener('click', () => {
			window.open(gif.source, '_blank');
		});
	}

	li.setAttribute('data-user', user);

	const sameUser = checkPrevMessage(user);

	if (user === nickName) {
		li.classList.add('self');
		user = 'You';
	}

	if (!sameUser) {
		const nameDiv = document.createElement('div');
		const strong = document.createElement('strong');
		strong.textContent = `${user}`;

		nameDiv.appendChild(strong);
		li.appendChild(nameDiv);
	} else {
		li.classList.add('same-sender');
	}

	img.src = gif.src;
	img.alt = gif.alt;

	li.appendChild(img);
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

const createUserMessage = (messageObj: iMsgObj) => {
	let { user, msg } = messageObj;

	const sameUser = checkPrevMessage(user);

	const li = document.createElement('li');
	const span = document.createElement('span');
	li.setAttribute('data-user', user);

	if (user === nickName) {
		li.classList.add('self');
		user = 'You';
	}

	if (!sameUser) {
		const nameDiv = document.createElement('div');
		const strong = document.createElement('strong');
		strong.textContent = `${user}`;

		nameDiv.appendChild(strong);
		li.appendChild(nameDiv);
	} else {
		li.classList.add('same-sender');
	}

	span.textContent = msg;

	li.appendChild(span);
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

const createSystemMessage = (content: string) => {
	const li = document.createElement('li');

	// message is a <span> tag containing any found nicknames inside an <em> tag
	const message = findName(content);

	li.appendChild(message);

	li.classList.add('system');
	msgContainer!.appendChild(li);

	msgContainer!.scrollTop = msgContainer!.scrollHeight;
};

const checkPrevMessage = (newMsgUser: string) => {
	const prevMessage = msgContainer!.lastElementChild;

	if (prevMessage && prevMessage instanceof HTMLLIElement) {
		const user = prevMessage.dataset.user;
		console.log(user, nickName);
		return user === newMsgUser;
	}
	return false;
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

let typingTimer: ReturnType<typeof setTimeout>;
const checkIfTyping = (socket: any) => {
	clearTimeout(typingTimer);

	typingTimer = setTimeout(() => {
		socket.emit('room:typing:stop');
	}, 1500);
	socket.emit('room:typing:start');
};

const createIsTypingMessage = (users: string[]) => {
	users = users.filter((user) => user !== nickName);

	if (users.length === 0) {
		isTypingUsers!.textContent = '';
		isTypingMessage!.textContent = '';
	} else if (users.length > 1) {
		isTypingUsers!.textContent = 'Several people';
		isTypingMessage!.textContent = ' are typing';
	} else {
		isTypingUsers!.textContent = `${users.join(', ')}`;
		isTypingMessage!.textContent = ' is typing';
	}
};
