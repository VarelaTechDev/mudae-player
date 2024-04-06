const { Client, Intents } = require('discord.js-selfbot-v13');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
	console.log(`${client.user.username} is ready!`);
});


// Original blacklist entries, not necessarily in lowercase
const originalBlacklist = ['Moona Hoshinova', 'Yogiri'];

// Convert each name in the blacklist to lowercase
const blacklist = originalBlacklist.map(name => name.toLowerCase());

// Function to extract kakera value from the description
function extractKakeraValue(description) {
	const kakeraPattern = /\*\*(\d+)\*\*/;
	const match = description.match(kakeraPattern);
	return match ? parseInt(match[1], 10) : null;
}

// Random delay function
function getRandomDelay(lowerBound, upperBound) {
	return Math.random() * (upperBound - lowerBound) + lowerBound;
}

client.on('messageCreate', async (message) => {
	if (message.mentions.has(client.user.id) && message.author.id === process.env.AUTHOR) {
		const messageLinkRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
		const match = message.content.match(messageLinkRegex);
		if (match) {
			const [, guildId, channelId, messageId] = match;
			try {
				const channel = await client.channels.fetch(channelId);
				const targetMessage = await channel.messages.fetch(messageId);
				let contentToLog = `Message Content: ${targetMessage.content}\n`;

				if (targetMessage.content.includes('Wished by')) {
					contentToLog += 'This character was wished.\n';
					message.channel.send('This character was wished').catch(console.error);
				}

				if (targetMessage.embeds.length > 0) {
					const embed = targetMessage.embeds[0];
					contentToLog += 'Embed:\n';

					// Blacklist check
					if (embed.author && embed.author.name && blacklist.includes(embed.author.name.toLowerCase())) {
						console.log('Character is ignored.');
						// Optionally, send a message to the channel
						setTimeout(() => {
							message.channel.send('Character is ignored').catch(console.error);
						}, getRandomDelay(500, 1500));
						// Stop processing further to ignore this character
						return;
					}

					const kakeraValue = extractKakeraValue(embed.description);
					if (kakeraValue !== null) {
						contentToLog += `Kakera Value: ${kakeraValue}\n`;
						if (kakeraValue > 400) {
							message.channel.send('Character greater than 400 kakera!').catch(console.error);
						}
					}

					if (embed.footer && embed.footer.text.includes('Belongs to')) {
						contentToLog += 'This character is already owned.\n';
						message.channel.send('This character is already owned').catch(console.error);
					}

					// Hololive detection
					if (embed.description && embed.description.toLowerCase().includes('hololive')) {
						contentToLog += 'Hololive detected.\n';
						// Adding a delay before sending the message
						setTimeout(() => {
							message.channel.send('Hololive detected').catch(console.error);
						}, getRandomDelay(500, 1500));
					}
				}

				// Write to a text file
				fs.writeFile('fetched_message_content.txt', contentToLog, (err) => {
					if (err) return console.error(`Error writing to file: ${err}`);
					console.log('Message content and embed data saved to fetched_message_content.txt');
				});


			}
			catch (error) {
				console.error(`Failed to fetch message: ${error}`);
			}
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
