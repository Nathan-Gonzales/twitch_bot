require('dotenv').config();
const express = require('express');
const port = 8080;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Cloud Run')
});

app.listen(port, ()=> {
    console.log('Server is running on port 8080');
});

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    website: {
        response: 'https://spacejelly.dev'
    },
    upvote: {
        response: (user) => `User ${user} was just upvoted!`
    },
}

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: TWITCH_BOT_USERNAME,
		password: TWITCH_OAUTH_TOKEN
	},
	channels: [ 'nathanieljenkins' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

    const [raw, command, argument] = message.match(regexpCommand);

    const {response} = commands[command] || {};

    if (typeof response === 'function') {
        client.say(channel, response(tags.username));
    }
    else if(typeof response === 'string') {
        client.say(channel, response);
    }

	// if(message.toLowerCase() === '!hello') {
	// 	// "@alca, heya!"
	// 	client.say(channel, `@${tags.username}, heya!`);
	// }
});
			