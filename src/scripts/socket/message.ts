const msgContainer = document.querySelector('.msg-container');
const msgForm = document.querySelector('form.msg-form');
const msgInput = msgForm?.querySelector('input');

if (msgContainer && msgForm && msgInput) {
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
}
