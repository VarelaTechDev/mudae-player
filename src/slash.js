require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const { scheduleTaskMinutes, killScheduleMinutes } = require('../Clock/delay.js');


client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);
    // client.user.setStatus('invisible');
});

function typeSlashCommand(message) {
    // Simulate typing
    message.channel.sendTyping();

    // Wait for 100 ms then send the message
    setTimeout(() => {
        message.channel.send('$wa').catch(console.error);
    }, 100);
}


client.on('messageCreate', async (message) => {
    if (message.author.id === process.env.AUTHOR && (message.content.startsWith('!k'))) {
        killScheduleMinutes();
        message.channel.send('Killed the scheduled task.').catch(console.error);
        return;
    }

    if (message.author.id === process.env.AUTHOR && (message.content.startsWith('!s'))) {
        scheduleTaskMinutes(1, typeSlashCommand, [message]);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);