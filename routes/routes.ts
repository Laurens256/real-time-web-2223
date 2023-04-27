import home from './home.js';
import rooms from './rooms.js';
import lobby from './lobby.js';

import gifs from './gifs.js';

const routes = [
	{ path: '/rooms/:id', view: lobby, viewName: 'LobbyView' },
	{ path: '/rooms', view: rooms, viewName: 'RoomView' },
	{ path: '/', view: home, viewName: 'HomeView' },

	// api routes
	{ path: '/api/gifs', view: gifs, viewName: '' },

	// { path: '*', view: error, viewName: 'ErrorView' }
];

export default routes;
