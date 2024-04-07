require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const { scheduleTaskMinutes, killScheduleMinutes } = require('../Clock/delay.js');


client.on('ready', () => {
    console.log(`${client.user.username} is ready!`);
    // client.user.setStatus('invisible');
});

function typeSlashCommand(message, repetitions = 1) {
    function sendCommand() {
        // Stop if no repetitions left
        if (repetitions <= 0) return;

        // Simulate typing
        message.channel.sendTyping();

        // Wait for a random delay between 100 ms and 500 ms, then send the message
        // Calculate random delay
        const delay = Math.random() * (500 - 100) + 100;
        setTimeout(() => {
            // message.channel.send('$wa').catch(console.error);
            message.channel.send(`I love you <3 ${repetitions}`).catch(console.error);
            // Decrease the repetition count
            repetitions--;
            // Call recursively to send the next command
            sendCommand();
        }, delay);
    }

    // Start sending commands
    sendCommand();
}

client.on('messageCreate', async (message) => {
    if (message.author.id === process.env.AUTHOR && message.content.startsWith('!k')) {
        killScheduleMinutes();
        message.channel.send('Killed the scheduled task.').catch(console.error);
        return;
    }

    if (message.author.id === process.env.AUTHOR && message.content.startsWith('!s')) {
        const args = message.content.split(' ');
        const repetitions = args.length > 1 ? parseInt(args[1], 10) : 1;
        if (!isNaN(repetitions)) {
            scheduleTaskMinutes(1, typeSlashCommand, [message, repetitions]);
        }
    }
});


client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
