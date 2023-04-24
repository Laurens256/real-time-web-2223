const currentlyTyping: { [room: string]: Set<string> } = {};

const getCurrentTyping = (
	room: string,
	user: string,
	action: 'add' | 'remove' | 'check'
) => {
	if (action !== 'check') {
		setCurrentTyping(room, user, action);
	}
	return currentlyTyping[room] ? Array.from(currentlyTyping[room]) : [];
};

const setCurrentTyping = (room: string, user: string, action: 'add' | 'remove') => {
	if (!currentlyTyping[room]) {
		currentlyTyping[room] = new Set();
	}

	if (action === 'add') {
		currentlyTyping[room].add(user);
	} else if (action === 'remove') {
		currentlyTyping[room].delete(user);
	}
};

export { getCurrentTyping };