const mainContainer = document.querySelector('.lobbyview') as HTMLElement;
const toggleChatButton: HTMLButtonElement | null = document.querySelector(
	'.chat section div button'
);

const initLobbyScript = () => {
	if (mainContainer && toggleChatButton) {
		toggleChatButton.addEventListener('click', toggleChat);
	} else if (toggleChatButton) {
		toggleChatButton.remove();
	}
};

const toggleChat = () => {
	mainContainer.classList.toggle('chat-hidden');
};


initLobbyScript();
