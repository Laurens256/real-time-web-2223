import express, { Request } from 'express';
import { roomExists, createRoom } from '../utils/manageRooms.js';

const router = express.Router({ mergeParams: true });

interface iReqWithParams extends Request {
	params: { id: string };
}

router.get('/', async (req: iReqWithParams, res) => {
	if (req.params.id === 'create') {
		return res.send(createRoom());
	} else if (roomExists(req.params.id)) {
		return res.render('lobby', {
			...res.locals,
			room: req.params.id
		});
	}

	res.render('error', {
		...res.locals,
		error: {
			heading: 'Room not found',
			message: 'The room you are looking for does not exist.'
		}
	});
});

export default router;
