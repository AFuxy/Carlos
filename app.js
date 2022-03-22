// import discord.js
const discord = require('discord.js');
// import .env
require('dotenv').config();
// import fs
const fs = require('fs');
// import colors
const colors = require('colors');

// client intents 
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });

global.footer = "Created by DarkMatter#1708";
global.developers = [
    '200612445373464576'
];

var activities = [
	{ msg: 'Minecraft', type: 'WATCHING' },
	{ msg: 'Survival', type: 'PLAYING' },
    { msg: 'PVP Battles', type: 5 },
    // { msg: '', type: '' },
]

setInterval(() => {
    var msg = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [{ name: msg.msg, type: msg.type }], status: 'online'});
}, 15e3);

setInterval(() => {
    // https://api.mcsrvstat.us
}, 6e4);