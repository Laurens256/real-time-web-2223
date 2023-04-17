const msgContainer = document.querySelector('.msg-container') as HTMLUListElement;
const msgForm = document.querySelector('form.msg-form') as HTMLFormElement;
const msgInput = msgForm.querySelector('input') as HTMLInputElement;

// @ts-expect-error // geen zin om te kutten met die socket types op de client
const socket = io();

msgForm.addEventListener('submit', (e) => {
	e.preventDefault();

	if (msgInput.value) {
		socket.emit('message', msgInput.value);
		msgInput.value = '';
	}
});

socket.on('message', (msg: string) => {
	msgContainer.appendChild(
		Object.assign(document.createElement('li'), { textContent: msg })
	);
	msgContainer.scrollTop = msgContainer.scrollHeight;
});