// import discord.js
const discord = require('discord.js');
const { MessageEmbed, Permissions } = require('discord.js');
// import superagent
const superagent = require('superagent');
// import .env
require('dotenv').config();
// import fs
const fs = require('fs');
// import colors
const colors = require('colors');
const cli = require('nodemon/lib/cli');

//get application version
const appversion = require('./package.json').version;
const config = require("./config.json");

const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const cpuStat = require("cpu-stat");

// client intents 
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });

global.footer = "Created by DarkMatter#1708 • Version " + appversion;
global.developers = [
    '200612445373464576'
];

var activities = [
	{ msg: 'Minecraft', type: 'WATCHING' },
	{ msg: 'Survival', type: 'PLAYING' },
    { msg: 'RP', type: 'PLAYING'},
    { msg: 'PVP Battles', type: 5 },
    // { msg: '', type: '' },
];

var mcServers = [
    { order: 1, ip: 'plutomc.xyz', name: 'Main Server', info: '_No Info Given_' },
    { order: 2, ip: '135.125.52.195:25579', name: 'Hub', info: 'The main hub where your adventure starts' },
    { order: 3, ip: '135.125.52.200:25599', name: 'Survival', info: 'Get Mining, Get Fighting!' },
    { order: 4, ip: '51.68.204.146:25570', name: 'RP', info: 'Let your fantasy role-play begin!' },
    // { order: 5, ip: '192.0.2.1', name: 'Factions', info: '_No Info Given_' },
    // { order: 6, ip: '192.0.2.1', name: 'Skyblock', info: '_No Info Given_' },
];

//random hex code generator
function randomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

setInterval(() => {
    var msg = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [{ name: msg.msg, type: msg.type }], status: 'online'});
}, 15e3);

client.once('ready', async () => {
    console.log('✔  '.green + colors.green(`Bot is ready | ${client.user.tag}`));
});

setInterval(() => {
    // https://api.mcsrvstat.us/2/${servers.ip}
    // https://mcapi.us/server/status?ip=${servers.ip}

    console.log(colors.cyan("updating... | " + new Date()));
    client.channels.cache.get(process.env.CHANNELID).messages.fetch(process.env.MESSAGEID).then(message => {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://mcapi.us/server/status?ip=${servers.ip}`).then(res => {
                maxplayers = res.body.players.max;
                nowplayers = res.body.players.now;
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733> ${nowplayers}/${maxplayers}\n**Info:** ${servers.info}\n\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462> | **Info:** ${servers.info}\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            const Status = new MessageEmbed()
            .setColor(randomHex())
            .setTitle('Server Status')
            .setDescription(`**IP:** plutomc.xyz\n**VERSIONS:** \`1.18 - 1.18.2\`\n**BEDROCK:** We support the latest version\n\n`+serverList+`\n**This updates every 10 minutes**`)
            // .addField('Servers', serverList)
            .setTimestamp()
            .setFooter({ text: footer });
            // send embed
            message.edit({ embeds: [Status] });
        }, mcServers.length * 1e3);
        });
}, 6e5);

// send a message when someone types status
client.on('messageCreate',async message => {
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8", {'flags': 'r+'}))

    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: config.prefix
        };
    }

    let prefix = prefixes[message.guild.id].prefixes;

    if (message.content === prefix+'status') {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://mcapi.us/server/status?ip=${servers.ip}`).then(res => {
                maxplayers = res.body.players.max;
                nowplayers = res.body.players.now;
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733> ${nowplayers}/${maxplayers}\n**Info:** ${servers.info}\n\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462> | **Info:** ${servers.info}\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            const Status = new MessageEmbed()
            .setColor(randomHex())
            .setTitle('Server Status')
            .setDescription(`**IP:** plutomc.xyz\n**VERSIONS:** \`1.18 - 1.18.2\`\n**BEDROCK:** We support the latest version\n\n`+serverList)
            // .addField('Servers', serverList)
            .setTimestamp()
            .setFooter({ text: footer });
            // send embed
            message.channel.send({ embeds: [Status] });
        }, mcServers.length * 1e3);
    }

    // help command
    if (message.content === prefix+'help') {
        message.channel.sendTyping()
        const Help = new MessageEmbed()
        .setColor(randomHex())
        .setTitle('Help')
        .addField(`**${prefix}help**`, '`for this list of commands`')
        .addField(`**${prefix}status**`, '`for the live server status`')
        .addField(`**More Coming Soon**`, '`Soon™`')
        .setTimestamp()
        .setFooter({ text: footer });
        // send embed
        message.channel.send({ embeds: [Help] });
    }

    // setprefix
    if (message.content.startsWith(prefix+'setprefix')) {
        // if (!message.author.id === '200612445373464576') return message.channel.send(`${message.author.username} You do not have permission to use this command!`);
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || !message.author.id === '200612445373464576') return message.channel.send(`${message.author.username}, You do not have permission to use this command!`);
        let newPrefix = message.content.split(' ').slice(1, 2)[0];
        prefixes[message.guild.id] = {
            prefixes: newPrefix
        };
        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
            if (err) console.log(err)
        });
        message.channel.send(`${message.author.username} Prefix has been set to ${newPrefix}`);
        client.guilds.cache.get(message.guildId).members.cache.get(client.user.id).setNickname(client.user.username + ' (' + newPrefix+ ')');
    }

    // when ating the bot send a message
    if (message.content.includes(client.user.id)) {
        message.channel.sendTyping()
        const embed = new MessageEmbed()
        .setColor(randomHex())
        .setDescription("**The prefix is** `"+prefix+"`\nDo `"+prefix+"help` for more info")
        // .setTimestamp()
        // .setFooter({ text: footer });
        message.channel.send({ embeds: [embed] });
    }

    // make custom announcements
    if (message.content.startsWith(prefix+'announce')) {
        //only people with a role can use this command
        if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
        // if (message.author.id === '200612445373464576') {
            const args = message.content.substring(prefix.length).split(" ");
            // const command = args.shift().toLowerCase();
            const announcement = args.slice(1).join(" ");
            if (announcement.length < 1) {
                message.channel.send('Please enter a message to announce.');
            } else {
                // embed
                const Announcement = new MessageEmbed()
                .setColor(randomHex())
                .setTitle('📜 General Announcement')
                .setDescription(announcement)
                .setTimestamp()
                .setFooter({ text: footer });
                // send embed
                message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' });
                // delete message after sending
                message.delete();
            }
        } else {
            message.delete();
            message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
        }
    }


    if (message.content.startsWith(prefix+'sannounce')) {
        //only people with a role can use this command
        if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
        // if (message.author.id === '200612445373464576') {
            const args = message.content.substring(prefix.length).split(" ");
            // const command = args.shift().toLowerCase();
            const announcement = args.slice(1).join(" ");
            if (announcement.length < 1) {
                message.channel.send('Please enter a message to announce.');
            } else {
                // embed
                const Announcement = new MessageEmbed()
                .setColor('#55FF55')
                .setTitle('🛠️ Survival Announcement - '+message.author.username)
                .setDescription(announcement)
                .setTimestamp()
                .setFooter({ text: footer });
                // send embed
                message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' });
                // delete message after sending
                message.delete();
            }
        } else {
            message.delete();
            message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
        }
    }

    if (message.content.startsWith(prefix+'rpannounce')) {
        //only people with a role can use this command
        if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
        // if (message.author.id === '200612445373464576') {
            const args = message.content.substring(prefix.length).split(" ");
            // const command = args.shift().toLowerCase();
            const announcement = args.slice(1).join(" ");
            if (announcement.length < 1) {
                message.channel.send('Please enter a message to announce.');
            } else {
                // embed
                const Announcement = new MessageEmbed()
                .setColor('#AA0000')
                .setTitle('⚔️ RP Announcement - '+message.author.username)
                .setDescription(announcement)
                .setTimestamp()
                .setFooter({ text: footer });
                // send embed
                message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' });
                // delete message after sending
                message.delete();
            }
        } else {
            message.delete();
            message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
        }
    }


    // change the nickname of the bot
    if (message.content.startsWith(prefix+'nick')) {
        if (message.author.id === '200612445373464576') {
            const args = message.content.substring(prefix.length).split(" ");
            var nick = args.slice(1).join(" ");
            //change nickname of the bot in the specifc server

            client.guilds.cache.get(message.guildId).members.cache.get(client.user.id).setNickname(nick);
            message.channel.send(`✔  Nickname changed to ${nick}`);
        } else {
            message.channel.send(`❌ You are not allowed to change the nickname!`);
        }
    }
    // list of guilds the bot is in with id
    if (message.content === prefix+'guilds') {
        message.channel.sendTyping()
        var guilds = "";
        client.guilds.cache.forEach(guild => {
            guilds = guilds + `**${guild.name}** | ${guild.id}\n`;
        });
        const Guilds = new MessageEmbed()
        .setColor(randomHex())
        .setTitle('Guilds')
        .setDescription(guilds)
        .setTimestamp()
        .setFooter({ text: footer });
        // send embed
        message.channel.send({ embeds: [Guilds] });
    }
    // leave a guild based on id
    if (message.content.startsWith(prefix+'leave')) {
        if (message.author.id === '200612445373464576') {
            var guildid = message.content.split(' ')[1];
            client.guilds.cache.get(guildid).leave();
            message.channel.send(`✔  Left guild ${guildid}`);
        } else {
            message.channel.send(`❌ You are not allowed to leave a guild!`);
        }
    }
    if(message.content == prefix+'stats') {
        message.channel.sendTyping()
        cpuStat.usagePercent(function(err, percent, seconds) {
			if (err) {
				return console.log(err);
			}

			var duration = moment
				.duration(client.uptime)
				.format(" D [days], H [hrs], m [mins], s [secs]");
			var Stats = new MessageEmbed()
				.setTitle("*** Stats ***")
				.setColor("#C0C0C0")
				.addField("• Mem Usage",`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,true)
				.addField("• Uptime ", `${duration}`, true)
				// .addField("• Discord.js", `v${version}`, true)
				// .addField("• Node", `${process.version}`, true)
                .addField("• Carlos", `\`v${appversion}\``, true)
				.addField("• CPU",`\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
				.addField("• CPU usage", `\`${percent.toFixed(2)}%\``, true)
				.addField("• Arch", `\`${os.arch()}\``, true)
				.addField("• Platform", `\`\`${os.platform()}\`\``, true)
				.setFooter({ text: footer });
                message.channel.send({ embeds: [Stats] });
            });
    }
});





// get the token from the .env file
client.login(process.env.TOKEN);