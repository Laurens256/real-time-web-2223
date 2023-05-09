import express, { Request, Response } from 'express';
const router = express.Router({ mergeParams: true });

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.TENOR_API_KEY;
const searchUrl = `https://g.tenor.com/v2/search?q=`;
const trendingUrl = `https://g.tenor.com/v2/trending_terms?limit=10`;

interface iReqWithParams extends Request {
	params: { type: string };
}

router.get('/', async (req: iReqWithParams, res) => {
	const type = req.params.type;

	switch (type) {
		case 'search':
			return await searchGifs(req, res);

		case 'trending':
			return await getTrendingCategories();
	}
});

const searchGifs = async (req: Request, res: Response) => {
	const query = req.query.query;
	if (query && typeof query === 'string' && query.length >= 2) {
		try {
			const gifs = (await (await tenorFetch(searchUrl + query)).json()).results;
			return res.json(cleanGifs(gifs));
		} catch (err) {
			console.log(err);
		}
	}
};

const getTrendingCategories = async () => {
	const categories = (await (await tenorFetch(trendingUrl)).json()).results;
	console.log(categories);
	return categories;
};

// prettier-ignore
const cleanGifs = (gifs: iGif[]) => {
	const cleanedGifs = gifs.map((gif) => {
		const { id, title, media_formats, created, content_description, url, tags } = gif;
		return {
			id: id,
			title: title,
			media_formats: { gif: media_formats.gif, gifpreview: media_formats.gifpreview, mediumgif: media_formats.mediumgif, tinygif: media_formats.tinygif },
			created: created,
			content_description: content_description,
			url: url,
			tags: tags
		};
	});
	return cleanedGifs;
};

export default router;

interface iGif {
	id: string;
	title: string;
	media_formats: {
		[format: string]: {
			url: string;
			duration: number;
			preview: string;
			dims: [number, number];
			size: number;
		};
	};
	created: number;
	content_description: string;
	itemurl: string;
	url: string;
	tags: string[];
	flags: string[];
	hasaudio: boolean;
}

const tenorFetch = (url: string) => {
	return fetch(`${url}&key=${apiKey}`);
};