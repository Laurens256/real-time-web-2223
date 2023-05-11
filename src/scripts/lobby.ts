const mainContainer = document.querySelector('.lobbyview') as HTMLElement;
const toggleChatButton: HTMLButtonElement | null = document.querySelector(
	'.sidebar section.chat header button'
);

const gifList = document.querySelector('dialog ul:last-of-type');
const gifSearchInput: HTMLInputElement | null = document.querySelector(
	'dialog input#gif_search'
);

const initLobbyScript = () => {
	if (mainContainer && toggleChatButton && gifList) {
		toggleChatButton.addEventListener('click', toggleChat);

		window.addEventListener('DOMContentLoaded', loadTrendingTerms);
	} else if (toggleChatButton) {
		toggleChatButton.remove();
	}
};

const toggleChat = () => {
	mainContainer.classList.toggle('chat-hidden');
};

const loadTrendingTerms = async () => {
	const trending: { term: string; gif: iGif }[] = [];
	const trendingTerms: string[] = await (await fetch('/api/gifs/trending')).json();

	await Promise.all(
		trendingTerms.map(async (term) => {
			const gifs = await (await fetch(`/api/gifs/search?query=${term}&limit=1`)).json();
			trending.push({ term: term, gif: gifs[0] });
		})
	);

	const termButtons = trending.map((trend) => {
		const li = document.createElement('li');
		const button = document.createElement('button');
		const span = document.createElement('span');
		const img = document.createElement('img');

		button.setAttribute('data-term', trend.term);
		button.addEventListener('click', quickLink);

		span.textContent = trend.term;

		img.src = trend.gif.media_formats.gif.url;
		img.alt = trend.gif.content_description;
		img.loading = 'lazy';

		button.append(span, img);
		li.appendChild(button);

		return li;
	});

	gifList!.append(...termButtons);
};

const quickLink = (e: MouseEvent) => {
	if (!gifSearchInput) return;
	const target = e.currentTarget as HTMLButtonElement;
	gifSearchInput.value = target.dataset.term || '';
	gifSearchInput.dispatchEvent(new CustomEvent('instantSearch'));
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
