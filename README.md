# Real-Time Web @cmda-minor-web 2022 - 2023

Pakkend verhaaltje hier nog

## Table of Contents

- [Week 1](#week-1)
- [Installation](#installation)

## Week 1

In week 1, we started by creating a basic chat-app using the [socket.io library](https://www.npmjs.com/package/socket.io). Using this library, we were able to create a chatroom where multiple users could join and chat with each other.

Building upon this basic socket.io application, I decided to make a web-application where users can create and join rooms to play a game / games together. Currently, I'm not sure what kind of game I want to make, but I'm thinking of something like connect 4 or other board / party games. Inside this game room, users will be able to chat with each other, and play the game together. The game will be played in real-time, so all users will be able to see the game state change as it happens.

Below is some of the client side code for sending messages to the server, and receiving messages from the server.

```ts
const initLobbyMsg = () => {
	if (msgContainer && msgForm && msgInput) {
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

		socket.on('room:message:system', (message: string) => {
			createSystemMessage(message);
		});
	}
};
```

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

<!-- Here are some hints for your projects Readme.md! -->

<!-- Start out with a title and a description -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- ☝️ replace this description with a description of your own work -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- This would be a good place for your data life cycle ♻️-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- We all stand on the shoulders of giants, please link all the sources you used in to create this project. -->

<!-- How about a license here? When in doubt use MIT. 📜  -->
