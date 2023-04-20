const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

const init = () => {
	const createRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/create"]'
	);

	const joinRoomForm: HTMLFormElement | null = document.querySelector(
		'form[action="/rooms/join"]'
	);

	// remove old nickname
	sessionStorage.removeItem('nickname');

	createRoomForm?.addEventListener('submit', createRoom);
	joinRoomForm?.addEventListener('submit', joinRoom);

	window.addEventListener('hashchange', togglePopup);
	window.dispatchEvent(new Event('hashchange'));
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

// function for managing popups
let currentPopup: HTMLElement | null = null;
const togglePopup = () => {
	const hash = window.location.hash;
	// remove hash icon from query
	const newPopup: HTMLElement | null = document.querySelector(
		`.${hash.substring(1)}-popup`
	);

	// hide current popup
	currentPopup?.classList.remove('active');
	currentPopup = null;

	// show new popup
	if (newPopup) {
		currentPopup = newPopup;
		newPopup.classList.add('active');
	}
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
