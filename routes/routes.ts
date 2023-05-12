import home from './home.js';
import lobby from './lobby.js';
import error from './error.js';

import gifs from './gifs.js';

const routes = [
	{ path: '/rooms/:id', view: lobby, viewName: 'LobbyView' },
	// { path: '/rooms', view: rooms, viewName: 'RoomView' },
	{ path: '/', view: home, viewName: 'HomeView' },

	// api routes
	{ path: '/api/gifs/:type', view: gifs, viewName: '' },
	// { path: '/api/gifs', view: gifs, viewName: '' },

	{ path: '*', view: error, viewName: 'ErrorView' }
];

export default routes;
