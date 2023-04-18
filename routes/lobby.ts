import express, { Request } from 'express';
import { roomExists } from '../utils/manageRooms.js';

const router = express.Router({ mergeParams: true });

interface iReqWithParams extends Request {
	params: { id: string };
}

router.get('/', async (req: iReqWithParams, res) => {
	if (roomExists(req.params.id)) {
		return res.render('lobby', {
			...res.locals,
			room: req.params.id
		});
	}

	res.send('room bestaat niet');
});

export default router;
