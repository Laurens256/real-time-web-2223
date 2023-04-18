const joinRoomForm: HTMLFormElement | null = document.querySelector('form[action="/rooms/join"]');
const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

const init = () => {
	window.addEventListener('hashchange', togglePopup);
	window.dispatchEvent(new Event('hashchange'));
	joinRoomForm?.addEventListener('submit', joinRoomById);
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

// joins room by id without having to submit a form
const joinRoomById = (e: SubmitEvent) => {
	e.preventDefault();
	const roomId = joinRoomInput?.value;
	if (roomId) {
		window.location.href = `/rooms/${roomId}`;
	}
};

init();
