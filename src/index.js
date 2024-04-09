const { Client, Intents } = require('discord.js-selfbot-v13');
// const client = new Client();
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', async () => {
	console.log(`${client.user.username} is ready!`);
	// client.user.setStatus('invisible')
});

function getRandomDelay(lowerBound, upperBound) {
	return Math.random() * (upperBound - lowerBound) + lowerBound;
}

// Function to extract kakera value from the description
function extractKakeraValue(description) {
	// Matches ** followed by digits (kakera value), followed by **
	const kakeraPattern = /\*\*(\d+)\*\*</;
	const match = description.match(kakeraPattern);
	// Returns the matched kakera value or null if not found
	return match ? match[1] : null;
}

let messagesLeftToSend = 0;
let killSwitchActivated = false;

function sendLoveMessage(channel, messagesToSend) {
	if (killSwitchActivated || messagesToSend <= 0) {
		// If the kill switch is activated or no messages left to send, stop the process
		messagesLeftToSend = 0;
		return;
	}

	setTimeout(() => {
		if (!killSwitchActivated) {
			channel.send('I love you <3').catch(console.error);
			messagesLeftToSend--;
			sendLoveMessage(channel, messagesLeftToSend);
		}
	}, getRandomDelay(900, 1500));
}


// Listen for messages in any channel the bot has access to
client.on('messageCreate', async (message) => {
	// Check if the message content is "pong" (case-insensitive)
	if (message.content.toLowerCase() === 'ping') {
		setTimeout(() => {
			message.reply('pong').catch(console.error);
		}, getRandomDelay(300, 800));
	}

	// Ensure the message is from the AUTHOR
	if (message.author.id !== process.env.AUTHOR) return;

	if (message.content.toLowerCase() === 'run') {
		// Add 10 messages to the counter each time "run" is invoked
		messagesLeftToSend += 10;
		killSwitchActivated = false;
		sendLoveMessage(message.channel, messagesLeftToSend);
	}
	else if (message.content.toLowerCase() === 'stop') {
		// Activate the kill switch to stop sending messages
		killSwitchActivated = true;
		messagesLeftToSend = 0;
		message.reply('Stopping messages.');
	}

	// Self
	if (message.channel.id === process.env.CHANNEL_ID && message.author.id === process.env.AUTHOR) {
		setTimeout(() => {
			message.react('👍').catch(console.error);
		}, getRandomDelay(300, 800));
	}

	if (message.author.id === process.env.AUTHOR) {
		setTimeout(() => {
			message.react('👍').catch(console.error);
		}, getRandomDelay(500, 1100));
	}

	if (message.author.id === process.env.MUDAE_USER_ID) {
		setTimeout(() => {
			fs.writeFile('vision.txt', message.content, err => {
				if (err) {
					console.error(`Error writing to file: ${err}`);
				}
				else {
					console.log(`Message from Mudae saved: ${message.content}`);
				}
			});
		}, getRandomDelay(300, 800));
	}

	if (message.author.id === process.env.MUDAE_USER_ID && message.embeds.length > 0) {
		const embed = message.embeds[0];
		let content = '';

		// Include the author name if present
		if (embed.author && embed.author.name) {
			content += `Title: ${embed.author.name}\n`;
		}

		// Append description
		if (embed.description) {
			content += `Description: ${embed.description}\n`;
			// Extract and append kakera value
			const kakeraValue = extractKakeraValue(embed.description);
			if (kakeraValue) {
				content += `Kakera Value: ${kakeraValue}\n`;
			}
		}

		// Iterate through any fields and append them
		embed.fields.forEach(field => {
			content += `${field.name}: ${field.value}\n`;
		});

		setTimeout(() => {
			fs.writeFile('vision_embed.txt', content, err => {
				if (err) {
					console.error(`Error writing to file: ${err}`);
				}
				else {
					console.log(`Embed from Mudae saved: ${content}`);
				}
			});
		}, getRandomDelay(300, 800));
	}
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
