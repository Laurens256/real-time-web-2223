const initGifs = () => {
	if (gifDialog && toggleGifDialogBtn && gifSearchInput && gifContainer) {
		toggleGifDialogBtn.addEventListener('click', toggleGifDialog);
		gifSearchInput.addEventListener('input', searchGifs);
	} else if (toggleGifDialogBtn) {
		toggleGifDialogBtn.remove();
	}
};

const toggleGifDialogBtn = document.querySelector('form > div button:first-of-type');
const gifDialog: HTMLDialogElement | null = document.querySelector('dialog');
const gifSearchInput: HTMLInputElement | null = document.querySelector(
	'dialog input#gif_search'
);
const gifContainer = document.querySelector('dialog ul');

const toggleGifDialog = () => {
	gifDialog!.open ? gifDialog!.close() : gifDialog!.show();
};

// set a timeout to prevent the api from being called too often
let searchDelay: ReturnType<typeof setTimeout>;
const searchGifs = async () => {
	clearTimeout(searchDelay);

	searchDelay = setTimeout(async () => {
		const query = gifSearchInput!.value;
		if (!query || query.length < 2) {
			gifContainer!.innerHTML = '';
		}

		const gifs: iGif[] = await (await fetch(`/api/gifs?query=${query}`)).json();
		console.log(gifs);

		gifContainer!.innerHTML = '';

		const fragment = document.createDocumentFragment();
		gifs.forEach((gif) => {
			const li = document.createElement('li');
			const button = document.createElement('button');

			button.addEventListener('click', sendGif);

			const img = document.createElement('img');
			img.src = gif.media_formats.gif.url;
			img.alt = gif.content_description;
			button.appendChild(img);
			li.appendChild(button);
			fragment.appendChild(li);
		});

		gifContainer!.appendChild(fragment);
	}, 500);
};

const sendGif = (e: MouseEvent) => {
	const button = e.currentTarget;

	if (button instanceof HTMLButtonElement) {
		const img = button?.querySelector('img');

		if (img instanceof HTMLImageElement) {
			const gif = { src: img.src, alt: img.alt };
			socket.emit('room:msg:gif', gif);
		}
	}
	toggleGifDialog();
};

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
