import express from 'express';
const router = express.Router();

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.TENOR_API_KEY;
let limit = 5;
const tenorUrl = `https://g.tenor.com/v2/search?limit=${limit}&key=${apiKey}&q=`;

router.get('/', async (req, res) => {
	const query = req.query.query;
	if (query && typeof query === 'string' && query.length >= 2) {
		const gifs = await getTenorGifs(query);
		res.json(gifs);
	}
});

const getTenorGifs = async (query: string) => {
	const gifs = (await (await fetch(tenorUrl + query)).json()).results;
	return cleanGifs(gifs);
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
