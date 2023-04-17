import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

import compression from 'compression';
import path from 'path';

// hbs
import { engine } from 'express-handlebars';

import routes from './routes/routes.js';

import * as dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// handlebars stuff
app.engine(
	'hbs',
	engine({
		layoutsDir: `${path.join(__dirname)}/views`,
		partialsDir: `${path.join(__dirname)}/views/partials`,
		defaultLayout: 'main',
		extname: '.hbs'
		// helpers: { ...hbsHelpers }
	})
);
app.set('view engine', 'hbs');
app.set('views', './views');

// static files
app.use(express.static(path.join(__dirname, '/public')));

// middleware
app.use(compression());

// routes
routes.forEach((route) => {
	app.use(route.path, route.view);
});

// socket.io
io.on('connect', (socket) => {
	socket.on('message', (message) => {
		io.emit('message', message);
	});
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
