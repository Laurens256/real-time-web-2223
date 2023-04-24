const actionButtonSection: HTMLElement | null = document.querySelector('.btn-section');
const formContainer: HTMLElement | null = document.querySelector('.start-form');
const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

const init = () => {
	const createRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/create"]'
	);

	const joinRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/join"]'
	);

	const toggleButtons: NodeListOf<HTMLButtonElement> =
		document.querySelectorAll('.btn-section button');

	// remove old nickname
	sessionStorage.removeItem('nickname');

	createRoomForm?.addEventListener('submit', createRoom);
	joinRoomForm?.addEventListener('submit', joinRoom);

	toggleButtons.forEach((button) => {
		button.addEventListener('click', toggleFormAction);
	});
	toggleButtons[0]?.click();
};

// get room code generated on server and join that room
const createRoom = async (e: SubmitEvent) => {
	e.preventDefault();
	const room = await (
		await fetch('/rooms/create', {
			headers: {
				create: 'true'
			}
		})
	).text();
	saveNickname('create');
	window.location.href = `/rooms/${room}`;
};

// get room code from input and join that room
const joinRoom = (e: SubmitEvent) => {
	e.preventDefault();
	saveNickname('join');
	window.location.href = `/rooms/${joinRoomInput?.value}`;
};

const toggleFormAction = (e: MouseEvent) => {
	const button = e.currentTarget;
	if (!button || !(button instanceof HTMLButtonElement)) return;

	const action = button.getAttribute('data-action') || 'create';

	actionButtonSection?.setAttribute('data-action', action);
	formContainer?.setAttribute('data-action', action);
};

// save nickname to session storage so it can be used in the room
const saveNickname = (target: 'join' | 'create') => {
	const input: HTMLInputElement | null = document.querySelector(
		`#${target}_nickname_input`
	);
	const nickname = input?.value || '';

	sessionStorage.setItem('nickname', nickname);
};

init();
