/**
 * @file Discord bot script
 * @module bot
 */

require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

/**
 * Event handler for when the bot is ready
 * @event Client#ready
 */
client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);
    // Uncomment the line below if you want your bot to appear offline or invisible
    // client.user.setStatus('invisible');
});

/**
 * Event handler for when a message is created
 * @event Client#messageCreate
 * @param {Message} message - The created message
 */
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

        /**
         * Send the command message after a delay of 500 milliseconds
         * @function
         * @param {string} command - The command to send
         */
        setTimeout(() => {
            message.channel.send(command).catch(console.error);
        }, 500);
    }

    // Handling DMs from the AUTHOR
    if (message.author.id === process.env.AUTHOR && message.channel.type === 'DM') {
        const args = message.content.split(' ');
        const channelId = args.shift();
        const messageToSend = args.join(' ');

        // Validate channel ID and message
        if (!channelId || !messageToSend) {
            message.author.send('Error: Invalid format. Please send the message in \'<Channel_ID> <Message>\' format.').catch(console.error);
            return;
        }

        // Try to send the message to the specified channel
        const targetChannel = await client.channels.fetch(channelId).catch(console.error);
        if (!targetChannel) {
            message.author.send(`Error: Could not find channel with ID ${channelId}.`).catch(console.error);
            return;
        }

        targetChannel.send(messageToSend).then(() => {
            message.author.send(`Message successfully sent to channel ${channelId}.`).catch(console.error);
        }).catch(error => {
            console.error(error);
            message.author.send(`Error: Failed to send message to channel ${channelId}. I might not have permission.`).catch(console.error);
        });

        // Skip further processing since this is a DM for sending a message
        return;
    }
});

/**
 * Log in the bot using the provided Discord bot token
 * @function
 * @param {string} process.env.DISCORD_BOT_TOKEN - The Discord bot token
 */
client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);

/**
 * Represents a Discord message
 * @typedef {Object} Message
 * @property {string} author.id - The ID of the message author
 * @property {string} content - The content of the message
 * @property {function} channel.send - Function to send a message to the channel
 */
