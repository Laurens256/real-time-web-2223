const mainContainer = document.querySelector('.lobbyview') as HTMLElement;
const toggleChatButton: HTMLButtonElement | null = document.querySelector(
	'.chat section div button'
);

const toggleGifDialogBtn = document.querySelector('form > div button:first-of-type');
const gifDialog: HTMLDialogElement | null = document.querySelector('dialog');
const gifSearchInput: HTMLInputElement | null = document.querySelector(
	'dialog input#gif_search'
);
const gifContainer = document.querySelector('dialog ul');

const initLobbyScript = () => {
	if (mainContainer && toggleChatButton) {
		toggleChatButton.addEventListener('click', toggleChat);
	} else if (toggleChatButton) {
		toggleChatButton.remove();
	}

	if (gifDialog && toggleGifDialogBtn && gifSearchInput && gifContainer) {
		toggleGifDialogBtn.addEventListener('click', toggleGifDialog);
		gifSearchInput.addEventListener('input', searchGifs);
	} else if (toggleGifDialogBtn) {
		toggleGifDialogBtn.remove();
	}
};

const toggleChat = () => {
	mainContainer.classList.toggle('chat-hidden');
};

const toggleGifDialog = (e: any) => {
	gifDialog!.open ? gifDialog!.close() : gifDialog!.show();
};

let searchDelay: ReturnType<typeof setTimeout>;
const searchGifs = async () => {
	clearTimeout(searchDelay);
	searchDelay = setTimeout(async () => {
		const query = gifSearchInput!.value;
		if (!query || query.length < 2) {
			gifContainer!.innerHTML = '';
		};

		const gifs: iGif[] = await (await fetch(`/api/gifs?query=${query}`)).json();
		console.log(gifs);

		const gifHtml = gifs
			.map((gif) => {
				return `
				<li>
					<button>
						<img loading="lazy" src="${gif.media_formats.gif.url}" alt="${gif.title}">
					</button>
				</li>
			`;
			})
			.join('');
		gifContainer!.innerHTML = gifHtml;
	}, 500);
};

initLobbyScript();

interface iGif {
	id: string;
	title: string;
	media_formats: {
		[format: string]: {
			url: string;
			duration: number;
			preview: string;
			dims: [number, number];
			size: number;
		};
	};
	created: number;
	content_description: string;
	url: string;
	tags: string[];
}
