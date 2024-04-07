require('dotenv').config();
const { Client} = require('discord.js-selfbot-v13');
const client = new Client();

client.on('ready', () => {
	console.log(`${client.user.username} is ready!`);
	// Uncomment the line below if you want your bot to appear offline or invisible
	// client.user.setStatus('invisible');
});

client.on('messageCreate', async (message) => {
	// Ignore messages sent by the bot itself to prevent loops
	if (message.author.id === client.user.id) return;

	if (message.author.id === process.env.AUTHOR && message.content === 'ping') {
		message.channel.send('$wa').catch(console.error);
	}

	// Check if the message is from the specified author and starts with the trigger
	if (message.author.id === process.env.AUTHOR && (message.content.startsWith('!p ') || message.content.startsWith('!'))) {
		const command = message.content.startsWith('!p ') ? message.content.slice('!p '.length) : message.content.slice('!'.length);

		// Check if the command is empty or consists only of spaces
		if (!command.trim()) {
			console.log('Command was empty or whitespace only. Skipping.');
			// Skip sending the message
			return;
		}


		setTimeout(() => {
			message.channel.send(command).catch(console.error);
		}, 500);
	}
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
