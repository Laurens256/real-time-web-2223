# Real-Time Web - Whack a Mole

Whack a Mole is a real-time multiplayer game where users can play a game of Whack a Mole with their friends. Users can create and join rooms with a private room code. Users are also able to chat and send gifs in the chat.

## Table of Contents

- [Features](#features)
- [Week 1](#week-1)
- [Week 2](#week-2)
- [Week 3](#week-3)
- [Code Highlights](#code-highlights)
- [Installation](#installation)

## Features

|        Feature        | Status |
| :-------------------: | :----: |
|   Chat in realtime    |   ✅   |
|   Custom usernames    |   ✅   |
|    Seperate rooms     |   ✅   |
| Create and join rooms |   ✅   |
|  Search and send gifs |   ✅   |
| Play game(s) in rooms |   ✅   |

## Week 1

In week 1, we started by creating a basic chat-app using the [socket.io library](https://www.npmjs.com/package/socket.io). Using this library, we were able to create a chatroom where multiple users could join and chat with each other.

Building upon this basic socket.io application, I decided to make a web-application where users can create and join rooms to play a game / games together. Currently, I'm not sure what kind of game I want to make, but I'm thinking of something like connect 4 or other board / party games. Inside this game room, users will be able to chat with each other, and play the game together. The game will be played in real-time, so all users will be able to see the game state change as it happens.

Below is some of the client side code for sending messages to the server, and receiving messages from the server.

```ts
const initLobbyMsg = () => {
	msgForm.addEventListener('submit', (e) => {
		e.preventDefault();

		if (msgInput.value) {
			socket.emit('room:msg', msgInput.value);
			msgInput.value = '';
		}
	});

	socket.on('room:msg', (messageObj: iMsgObj) => {
		createUserMessage(messageObj);
	});
};
```

In week 1, most of my time was spent developing the technical aspects of the website. In the coming weeks, I want to spend more time on the frontend / styling of the application. This is what the rooms page currently looks like.

<p align="center">
	<img src="./docs/img/week_1.png" alt="game room">
</p>

## Week 2

In week 2, I implemented the [Tenor Api](https://tenor.com/gifapi). Using the Tenor api, users can search for gifs and send them in the chat. The gif will then be displayed in the chat, and all users in the room will be able to see it. To toggle the gif search dialog, I made use of the relatively new `<dialog>` element. This element can be used as a native HTML modal which is great for accessibility.

```html
<dialog>
	<section>
		<label for="gif_search">Search Tenor</label>
		<input
			id="gif_search"
			name="gif_search"
			type="text"
			value=""
			placeholder="Search Tenor" />
	</section>
	<ul></ul>
	<ul></ul>
</dialog>
```

The following dialog can be toggled with Javascript using the `dialog.close()` and `dialog.show()` methods.

## Week 3

In week 3 I finally started working on my Whack a Mole game. I decided to go with this game because it's relatively simple to make, and I didn't have a lot of time left. The moles are controlled by the server, and the clients can send requests to the server to "whack" the mole. The client and server both check if the hole is valid, and if it is the user will get a point. The game lasts 40 seconds (might change) and the user who whacked the most moles wins. Below is the server side code responsible for spawning moles

```ts
let currentPlayers = 0;
let moleTimeout: ReturnType<typeof setTimeout>;
const spawnMoles = (holes: number, io: any, socket: any, delay = 1500) => {
	moleTimeout = setTimeout(() => {
		// get a random hole
		const randomHole = Math.floor(Math.random() * holes);

		// if the hole is not active, activate it
		if (!activeHoles.has(randomHole)) {
			activeHoles.add(randomHole);
			io.to(socket.room).emit('room:mole:emerge', randomHole);
		}

		// if the hole is still active after n delay, deactivate it
		setTimeout(() => {
			if (activeHoles.has(randomHole)) {
				io.to(socket.room).emit('room:mole:whack', randomHole);

				// nested timeout so the mole can still be whacked as it's going down
				setTimeout(() => {
					activeHoles.delete(randomHole);
				}, 400);
			}
		}, 1000);

		const delaySubtraction = Math.min(50 * currentPlayers, 150);
		const newDelay = delay - delaySubtraction > 300 ? delay - delaySubtraction : 300;
		// spawn another mole with a shorter delay
		spawnMoles(holes, io, socket, newDelay);
	}, delay);
};
```

The code above will spawn a mole in a random hole, and after a certain amount of time it will despawn the mole if it has not been whacked. The delay between spawning and despawning a mole will decrease over time, making the game harder.

## Code Highlights

Below are some cool pieces of code that highlight some of the features of this project.

<details>
  <summary>Calculate prime numbers 😼</summary>

```ts
console.log('hello world');
```

</details>

<details>
  <summary>(Client) Searching gifs on Tenor without making too many api calls while typing</summary>

```ts
// set a timeout to prevent the api from being called too often
let searchDelay: ReturnType<typeof setTimeout>;
const searchGifs = async (delay: number) => {
	clearTimeout(searchDelay);

	searchDelay = setTimeout(async () => {
		const query = gifSearchInput!.value;
		if (!query || query.length < 2) {
			gifContainer!.innerHTML = '';
			gifDialog!.classList.add('empty');
			return;
		}

		...

	}, delay);
};
```

</details>

<details>
  <summary>(Build)Gulp build script for compiling and bundling Typescript</summary>

```ts
import gulp from 'gulp';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

const tsConfig1 = ts.createProject('src/scripts/tsconfig.json');
const tsConfig2 = ts.createProject('src/scripts/tsconfig.json');

// minify all ts files except ts files under socket folder
(() => {
	return gulp
		.src(['src/scripts/**/*.ts', '!src/scripts/socket/*.ts'], { base: './src' })
		.pipe(tsConfig1())
		.pipe(uglify({ mangle: true }))
		.pipe(gulp.dest('./dist/public/'));
})();

// files in socket folder get minified and bundled into socket.js, make sure socket.ts is first, then all other ts files except manager.ts, then manager.ts
(() => {
	return gulp
		.src(
			[
				'src/scripts/socket/socket.ts',
				'src/scripts/socket/!(manager).ts',
				'src/scripts/socket/manager.ts'
			],
			{ base: './src' }
		)
		.pipe(tsConfig2())
		.pipe(concat('socket.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/public/scripts'));
})();
```

</details>

## Installation

1. Clone the repository

```bash
$ git clone git@github.com:Laurens256/real-time-web-2223.git
```

2. Navigate to the folder

```bash
$ cd FOLDER-NAME/real-time-web-2223
```

3. Install the (dev)dependencies

```bash
$ npm install
```

4. Start the website in development mode

```bash
$ npm run dev
```

5. Open the website in your browser

```
http://localhost:3000/
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- Start out with a title and a description -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- This would be a good place for your data life cycle ♻️-->
