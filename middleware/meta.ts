import { Request, Response, NextFunction } from 'express';

import { findRoute } from '../utils/findRoute.js';

const setMeta = async (req: Request, res: Response, next: NextFunction) => {
	const view = await findRoute(req.url.split('?')[0]);
	const viewName = (view.route.viewName as keyof typeof metaData) || 'Fallback';

	res.locals.meta = metaData[viewName] ?? metaData.Fallback;
	res.locals.meta.viewName = viewName;

	next();
};

const metaData = {
	HomeView: {
		title: 'RealTime Web | Home',
		description: '',
		scripts: ['home', 'socket']
	},
	Fallback: {
		title: 'RealTime Web',
		description: '',
		scripts: []
	},
	RoomView: {
		title: 'RealTime Web | Rooms',
		description: '',
		scripts: ['socket']
	},
	LobbyView: {
		title: 'RealTime Web | Lobby',
		description: '',
		scripts: ['socket', 'lobby']
	}
};

export { setMeta };
