// @ts-nocheck

// the entire 'socket' folder get bundled into a single file so inside this file we are calling functions from other files even though they are not imported. Would be too much of a headache to do it the "correct" way because gulp is annoying and I don't want to spend time on it

// regex that matches for /rooms/ + id with length of 6 containing only letters and numbers
const roomRegex = /^\/rooms\/[a-zA-Z0-9]{6}$/;
(() => {
	const path = window.location.pathname;
	if (roomRegex.test(path)) {
		initLobby();
	}
})();
