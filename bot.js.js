const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // Lädt Token und IDs aus .env

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

// IDs aus der .env laden
const START_CHANNEL_ID = process.env.START_CHANNEL_ID;
const END_CHANNEL_ID = process.env.END_CHANNEL_ID;
const CONTROL_CHANNEL_ID = process.env.CONTROL_CHANNEL_ID;

client.on('ready', () => {
    console.log(`Bot ist online als ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.channel.id === START_CHANNEL_ID || message.channel.id === END_CHANNEL_ID) {
        const controlChannel = await client.channels.fetch(CONTROL_CHANNEL_ID);
        const prefix = message.channel.id === START_CHANNEL_ID ? '🚛 Schicht START' : '🚛 Schicht ENDE';

        // Den Nickname des Users holen, falls vorhanden, sonst Username
        const fahrerName = message.member ? message.member.displayName : message.author.username;

        await controlChannel.send({
            content: `${prefix}\n👤 Fahrer: ${fahrerName}\n🕒 ${new Date().toLocaleString()}\n${message.content || ''}`,
            files: message.attachments.map(att => att.url)
        });
    }
});

client.login(process.env.TOKEN);
