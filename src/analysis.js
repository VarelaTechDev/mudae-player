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

async function processMessageLink(url, ctx) {
	const messageLinkRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
	const match = url.match(messageLinkRegex);
	if (!match) return console.log('Invalid message link.');

	const [, guildId, channelId, messageId] = match;
	try {
		const channel = await ctx.client.channels.fetch(channelId);
		const message = await channel.messages.fetch(messageId);

		console.log('Fetched message:', message.content);
		// Example: Check for certain keywords in the message content
		if (message.content.includes('Wished by')) {
			console.log('This character was wished.');
			// You can extend this to perform more actions, like sending a response in the channel
			await ctx.channel.send('This character was wished').catch(console.error);
		}

		// Add any other checks or actions you want to perform based on the message
	}
	catch (error) {
		console.error(`Failed to fetch message: ${error}`);
	}
}


client.on('messageCreate', async (message) => {
	if (message.mentions.has(client.user.id) && message.author.id === process.env.AUTHOR) {
		// Assuming the message might contain more text alongside the URL
		const words = message.content.split(/\s+/);
		const url = words.find(word => word.startsWith('https://discord.com/channels/'));
		if (url) {
			await processMessageLink(url, { client, channel: message.channel });
		}
	}

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
					// console.log(embed);
					contentToLog += 'Embed:\n';
					// console.log(targetMessage);
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

			try {
				// Fetch the message again to ensure you have the most current state including reactions
				const freshMessage = await message.channel.messages.fetch(message.id);

				// console.log(freshMessage);

				// Check for kakera reaction by emoji ID
				const kakeraEmojiId = '605112954391887888';
				const kakeraReaction = freshMessage.reactions.cache.find(reaction => reaction.emoji.id === kakeraEmojiId);

				if (kakeraReaction) {
					console.log('Kakera react emoji found on the message!');
					// Perform your desired action here
				}
			}
			catch (error) {
				console.error(`An error occurred: ${error}`);
			}
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
