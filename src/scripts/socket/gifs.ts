const initGifs = () => {
	if (gifDialog && toggleGifDialogBtn && gifSearchInput && gifContainer) {
		gifSearchInput.value = '';
		gifDialog.classList.add('empty');
		toggleGifDialogBtn.addEventListener('click', toggleGifDialog);
		gifSearchInput.addEventListener('input', searchGifs.bind(null, 500));
		gifSearchInput.addEventListener('instantSearch', searchGifs.bind(null, 0));
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
	if (gifDialog!.open) {
		gifDialog!.close();
		gifSearchInput!.value = '';
		gifContainer!.innerHTML = '';
		gifDialog!.classList.add('empty');
		window.removeEventListener('click', lightDismiss);
	} else {
		gifDialog!.show();
		// timeout so the click event doesn't fire immediately when button is clicked
		setTimeout(() => {
			window.addEventListener('click', lightDismiss);
		}, 10);
	}
};

// dismiss the dialog if the user clicks outside of it
const lightDismiss = (e: MouseEvent) => {
	if (e.target instanceof HTMLElement && !e.target.closest('dialog')) {
		toggleGifDialog();
	}
};

// set a timeout to prevent the api from being called too often
let searchDelay: ReturnType<typeof setTimeout>;
const searchGifs = async (delay?: number) => {
	clearTimeout(searchDelay);

	searchDelay = setTimeout(async () => {
		const query = gifSearchInput!.value;
		if (!query || query.length < 2) {
			gifContainer!.innerHTML = '';
			gifDialog!.classList.add('empty');
			return;
		}

		const gifs: iGif[] = await (await fetch(`/api/gifs/search?query=${query}`)).json();

		gifContainer!.innerHTML = '';

		const fragment = document.createDocumentFragment();
		gifs.forEach((gif) => {
			const li = document.createElement('li');
			const button = document.createElement('button');

			button.addEventListener('click', sendGif);

			const img = document.createElement('img');
			img.src = gif.media_formats.gif.url;
			img.alt = gif.content_description;
			img.loading = 'lazy';

			img.setAttribute('data-src', gif.url);

			button.appendChild(img);
			li.appendChild(button);
			fragment.appendChild(li);
		});

		gifDialog!.classList.remove('empty');

		gifContainer!.appendChild(fragment);
	}, delay);
};

const sendGif = (e: MouseEvent) => {
	const button = e.currentTarget;

	if (button instanceof HTMLButtonElement) {
		const img = button?.querySelector('img');

		if (img instanceof HTMLImageElement) {
			const gif = { src: img.src, alt: img.alt, source: img.dataset.src };
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
