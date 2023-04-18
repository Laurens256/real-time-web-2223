import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('home', {
		...res.locals
	});
});

export default router;