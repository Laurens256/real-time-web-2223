import chat from './chat.js';
import home from './home.js';

const routes = [
	// { path: '/filters', view: filters, viewName: 'FilterView' },
	// { path: '/pokemon/:name', view: pokemonDetails, viewName: 'PokemonDetailsView' },
	// { path: '/pokemon', view: pokemonList, viewName: 'PokemonListView' },
	{ path: '/chat', view: chat, viewName: 'ChatView' },
	{ path: '/', view: home, viewName: 'HomeView' },

	// { path: '*', view: error, viewName: 'ErrorView' }
];

export default routes;