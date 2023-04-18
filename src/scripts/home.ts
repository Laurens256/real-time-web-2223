const init = () => {
	window.addEventListener('hashchange', togglePopup);
	window.dispatchEvent(new Event('hashchange'));
};

// function for managing popups
let currentPopup: HTMLElement | null = null;
const togglePopup = () => {
	const hash = window.location.hash;
	// remove hash icon from query
	const newPopup: HTMLElement | null = document.querySelector(
		`.${hash.substring(1)}-popup`
	);

	// hide current popup
	currentPopup?.classList.remove('active');
	currentPopup = null;

	// show new popup
	if (newPopup) {
		currentPopup = newPopup;
		newPopup.classList.add('active');
	}
};

init();
