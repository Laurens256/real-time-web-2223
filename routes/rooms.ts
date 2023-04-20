import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	res.render('rooms', {
		...res.locals
	});
});

export default router;