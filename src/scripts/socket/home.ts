const initHome = () => {
	const createRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/create"]'
	);

	const joinRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/join"]'
	);

	createRoomForm?.addEventListener('submit', createRoom);
	joinRoomForm?.addEventListener('submit', joinRoom);
};

const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

const createRoom = (e: SubmitEvent) => {
	e.preventDefault();
	saveNickname('create');
	socket.emit('room:create');
};

const joinRoom = (e: SubmitEvent) => {
	e.preventDefault();
	saveNickname('join');
	window.location.href = `/rooms/${joinRoomInput?.value}`;
};

socket.on('room:create:success', (room: string) => {
	window.location.href = `/rooms/${room}`;
});

const saveNickname = (target: 'join' | 'create') => {
	const input: HTMLInputElement | null = document.querySelector(`#${target}_nickname_input`);
	const nickname = input?.value || '';
	
	sessionStorage.setItem('nickname', nickname);
};