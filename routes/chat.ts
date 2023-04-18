import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('chat', {
		...res.locals
	});
});

export default router;
