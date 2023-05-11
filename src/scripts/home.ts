const actionButtonSection: HTMLElement | null = document.querySelector('.btn-section');
const formContainer: HTMLElement | null = document.querySelector('.start-form');
const joinRoomInput: HTMLInputElement | null = document.querySelector('#join_input');

const initHomeScript = () => {
	const roomForm: HTMLElement | null = document.querySelector('form[action="/rooms"]');

	roomForm?.addEventListener('submit', handleFormSubmit);

	const toggleButtons: NodeListOf<HTMLButtonElement> =
		document.querySelectorAll('.btn-section button');

	// remove old nickname
	sessionStorage.removeItem('nickname');

	toggleButtons.forEach((button) => {
		button.addEventListener('click', toggleFormAction);
	});
	toggleButtons[0]?.click();
};

const handleFormSubmit = async (e: SubmitEvent) => {
	e.preventDefault();
	saveNickname();

	const action = formContainer!.getAttribute('data-action') || 'create';

	let room = '';
	if (action === 'create') {
		room = await (
			await fetch('/rooms/create', {
				headers: {
					create: 'true'
				}
			})
		).text();
	} else {
		room = joinRoomInput?.value || '';
	}
	window.location.href = `/rooms/${room}`;
};

const toggleFormAction = (e: MouseEvent) => {
	const button = e.currentTarget;
	if (!button || !(button instanceof HTMLButtonElement)) return;

	const action = button.getAttribute('data-action') || 'create';

	actionButtonSection?.setAttribute('data-action', action);
	formContainer?.setAttribute('data-action', action);
};

// save nickname to session storage so it can be used in the room
const saveNickname = () => {
	const input: HTMLInputElement | null = document.querySelector(`#nickname_input`);
	const tempNickname = input?.value || '';

	sessionStorage.setItem('nickname', tempNickname);
};

initHomeScript();
