import home from './home.js';
import rooms from './rooms.js';
import lobby from './lobby.js';

const routes = [
	{ path: '/rooms/:id', view: lobby, viewName: 'LobbyView' },
	{ path: '/rooms', view: rooms, viewName: 'RoomView' },
	{ path: '/', view: home, viewName: 'HomeView' }

	// { path: '*', view: error, viewName: 'ErrorView' }
];

export default routes;
