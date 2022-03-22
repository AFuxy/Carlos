// import discord.js
const discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
// import superagent
const superagent = require('superagent');
// import .env
require('dotenv').config();
// import fs
const fs = require('fs');
// import colors
const colors = require('colors');
const cli = require('nodemon/lib/cli');

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
];

var mcServers = [
    { order: 1, ip: 'plutomc.xyz', name: 'Main Server' },
    { order: 2, ip: '135.125.52.195:25579', name: 'Hub' },
    { order: 3, ip: '135.125.52.200:25599', name: 'Survival' },
    // { order: 4, ip: '192.0.2.1', name: 'RP' },
    // { order: 5, ip: '192.0.2.1', name: 'Factions' },
    // { order: 6, ip: '192.0.2.1', name: 'Skyblock' },
];

setInterval(() => {
    var msg = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [{ name: msg.msg, type: msg.type }], status: 'online'});
}, 15e3);

client.once('ready', async () => {
    console.log('✔  '.green + colors.green(`Bot is ready | ${client.user.tag}`));
});

setInterval(() => {
    // https://api.mcsrvstat.us
    // https://mcapi.us/server/status?ip=${servers.ip}

    console.log(colors.cyan("updating... | " + new Date()));
    client.channels.cache.get('955646195777273917').messages.fetch('955892006356414494').then(message => {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://api.mcsrvstat.us/2/${servers.ip}`).then(res => {
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733>\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            const Status = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Server Status')
            .setDescription(`**IP:** plutomc.xyz\n\n`+serverList+`\n**This updates every 2 minutes**`)
            // .addField('Servers', serverList)
            .setTimestamp()
            .setFooter({ text: footer});
            // send embed
            message.edit({ embeds: [Status] });
        }, mcServers.length * 1e3);
        });
}, 12e4);


// send a message when someone types status
client.on('messageCreate',async message => {
    if (message.content === '!status') {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://api.mcsrvstat.us/2/${servers.ip}`).then(res => {
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733>\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            const Status = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Server Status')
            .setDescription(`**IP:** plutomc.xyz\n\n`+serverList)
            // .addField('Servers', serverList)
            .setTimestamp()
            .setFooter({ text: footer});
            // send embed
            message.channel.send({ embeds: [Status] });
        }, mcServers.length * 1e3);
    }
    if(message.content == '!update') {
        message.delete();
        client.channels.cache.get('955646195777273917').messages.fetch('955892006356414494').then(message => {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://api.mcsrvstat.us/2/${servers.ip}`).then(res => {
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733>\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            const Status = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Server Status')
            .setDescription(`**IP:** plutomc.xyz\n\n`+serverList)
            // .addField('Servers', serverList)
            .setTimestamp()
            .setFooter({ text: footer});
            // send embed
            message.edit({ embeds: [Status] });
        }, mcServers.length * 1e3);
        });
    }
});





// get the token from the .env file
client.login(process.env.TOKEN);