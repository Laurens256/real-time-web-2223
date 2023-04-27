const mainContainer = document.querySelector('.lobbyview') as HTMLElement;
const toggleChatButton: HTMLButtonElement | null = document.querySelector(
	'.chat section div button'
);

const toggleGifDialogBtn = document.querySelector('form > div button:first-of-type');
const gifDialog: HTMLDialogElement | null = document.querySelector('dialog');
const gifSearchInput: HTMLInputElement | null = document.querySelector(
	'dialog input#gif_search'
);

const initLobbyScript = () => {
	if (mainContainer && toggleChatButton) {
		toggleChatButton.addEventListener('click', toggleChat);
	}

	if (toggleGifDialog && toggleGifDialogBtn && gifSearchInput) {
		toggleGifDialogBtn.addEventListener('click', toggleGifDialog);
		gifSearchInput.addEventListener('input', searchGifs);
	} else if (toggleGifDialogBtn) {
		toggleGifDialogBtn.remove();
	}
};

const toggleChat = () => {
	mainContainer.classList.toggle('chat-hidden');
};

const toggleGifDialog = () => {
	// gifDialog!.open ? gifDialog!.close() : gifDialog!.show();
};

const searchGifs = async () => {
	console.log('aaa');
};

initLobbyScript();

document.addEventListener(
	'focusin',
	function () {
		console.log('focused: ', document.activeElement);
	},
	true
);
