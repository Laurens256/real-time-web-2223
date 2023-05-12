import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
	res.render('error', {
		...res.locals,
		error: {
			heading: '404',
			message: 'Page not found'
		}
	});
});

export default router;