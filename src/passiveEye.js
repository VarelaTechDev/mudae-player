require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const client = new Client();

const queue = [];
const list = [];

const blacklist = ['blacklisted name'];
const channelId = '1227069550659371018';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// This method reacts to a message given its link
async function reactToMessageWithLink(messageLink) {
    const messageLinkRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    const match = messageLink.match(messageLinkRegex);
    if (match) {
        const [, guildId, channelId, messageId] = match;
        try {
            const channel = await client.channels.fetch(channelId);
            const targetMessage = await channel.messages.fetch(messageId);

            // React to the linked message with a thumbs up emoji
            await targetMessage.react('👍');
            console.log(`Reacted with 👍 to message: ${messageId}`);
        }
        catch (error) {
            console.error('Error reacting to message:', error);
        }
    }
    else {
        console.log('No valid message link found for reaction.');
    }
}


async function processMessage(message) {
    // Simulate computation delay
    // 3 second delay
    await computationDelay(3000);

    // Construct the message link
    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

    let contentToLog = `${message.content} : ${messageLink}\n`;

    // Process embeds of the current message
    if (message.embeds.length > 0) {
        contentToLog += processEmbeds(message.embeds);
    }

    // Check for message link in content and append fetched message if exists
    const messageLinkRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    const match = message.content.match(messageLinkRegex);
    if (match) {
        const [, , channelId, messageId] = match;
        try {
            // Extract the full matched link

            const channel = await client.channels.fetch(channelId);
            const targetMessage = await channel.messages.fetch(messageId);
            await reactToMessageWithLink(targetMessage);

            contentToLog += `Linked Message Content: ${targetMessage.content}\nLinked Message: ${messageLink}\n`;

            // Include logic for 'Wished by'
            if (targetMessage.content.includes('Wished by')) {
                contentToLog += 'This character was wished.\n';
            }

            // Process embeds of the linked message
            if (targetMessage.embeds.length > 0) {
                contentToLog += processEmbeds(targetMessage.embeds);
            }
        }
        catch (error) {
            console.error('Error fetching linked message:', error);
        }
    }

    // Add formatted message to the list
    list.push(contentToLog);
}

function processEmbeds(embeds) {
    let embedContent = 'Embeds:\n';
    for (const embed of embeds) {
        // Check if the embed's author is in the blacklist
        if (embed.author && blacklist.includes(embed.author.name.toLowerCase())) {
            console.log('Character is ignored.');
            return 'Embed ignored due to blacklist.\n';
        }

        if (embed.author) {
            embedContent += `Author: ${embed.author.name}\n`;
        }
        if (embed.title) {
            embedContent += `Title: ${embed.title}\n`;
        }
        if (embed.description) {
            embedContent += `Description: ${embed.description}\n`;
        }
        // Add more fields as needed
    }
    return embedContent;
}


async function computationDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('message', async (message) => {
    if (message.channel.id !== channelId) return;

    // Add the message to the queue
    queue.push(message);

    // Process messages from the queue
    while (queue.length > 0) {
        const msg = queue.shift();
        await processMessage(msg).then((contentToLog) => list.push(contentToLog));
      }      

    // Handle commands
    if (message.author.id === process.env.AUTHOR) {
        if (message.content === '#clear') {
            list.length = 0;
            console.log('List cleared');
        }
        else if (message.content === '#write') {
            const filename = `output-${Date.now()}.txt`;
            fs.writeFileSync(filename, list.join('\n'));
            console.log(`List written to ${filename}`);
            // Optionally clear the list after writing
            list.length = 0;
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
