const init = () => {
	window.addEventListener('hashchange', togglePopup);
	window.dispatchEvent(new Event('hashchange'));
};

let currentPopup: HTMLElement | null = null;
const togglePopup = () => {
	const hash = window.location.hash;
	const newPopup: HTMLElement | null = document.querySelector(
		`.${hash.replace('#', '')}-popup`
	);

	// hide current popup
	currentPopup?.classList.remove('active');

	// show new popup
	if (newPopup) {
		currentPopup = newPopup;
		newPopup.classList.add('active');
	}
};

init();
