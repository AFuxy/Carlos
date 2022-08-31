// import discord.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, ActivityType, EmbedBuilder, Permissions, InteractionType, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } = require('discord.js');
// const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
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
client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

global.footer = "Created by DarkMatter#1708 • Version " + appversion;
global.developers = [
    '200612445373464576'
];
global.mcServers = [
    { order: 1, ip: 'mcs.afuxy.com', name: 'MCS', info: 'MC Showdown' },
    // { order: 2, ip: '135.125.52.195:25579', name: 'Hub', info: 'The main hub where your adventure starts' },
    // { order: 3, ip: '135.125.52.200:25599', name: 'OP Prison', info: 'Mine your way to the top in OP Prison!' },
    // { order: 4, ip: '51.68.204.146:25570', name: 'Enhanced Survival', info: 'Survive and thrive in this new advanced survival!' },
    // { order: 5, ip: '51.89.194.163:25576', name: 'Skyblock', info: 'From lore to custom items, Super Skyblock has got you covered!' },
    // { order: 6, ip: '192.0.2.1', name: 'Factions', info: '_No Info Given_' },
];

var activities = [
    { msg: appversion, type: ActivityType.Watching },
	// { msg: 'Minecraft', type: 'WATCHING' },
	// { msg: 'Prison', type: 'PLAYING' },
    // { msg: 'Enhanced Survival', type: 'PLAYING'},
    //{ msg: 'PVP Battles', type: 5 },
    // { msg: '', type: '' },
];

//random hex code generator
module.exports = function randomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
const randomHex = require('./app.js');
setInterval(() => {
    var msg = activities[Math.floor(Math.random() * activities.length)]
    client.user.setPresence({ activities: [{ name: msg.msg, type: msg.type }], status: 'online'});
}, 15e3);

console.log('➤  '.gray + "Started loading commands".gray);
client.commands = new Collection();
let commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith('.js'));
commandFiles.forEach(commandName => {
    let command = require(`./commands/${commandName}`);
    console.log('➤  '.gray + `Loading command: ${command.name}`.gray);
    client.commands.set(command.name, command);
})
console.log('➤  '.gray + "Finished loading commands".gray);

async function refreshSlashCommands(){
    function setStandardOptions(baseoption, optiondata){
        baseoption.setName(optiondata.name);
        baseoption.setDescription(optiondata.description);
        baseoption.setRequired(optiondata.required ?? false);
        return baseoption;
    }
    const slashcollection = [];
    client.commands.forEach(command => {
        const slashcommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description ?? utility.getText("english", command.name, "commandDescription"));
        if(command.options) command.options.forEach(option => {
            if(option.type == "USER"){
                slashcommand.addUserOption(useroption => {
                    return setStandardOptions(useroption, option);
                });
            }else if(option.type == "STRING"){
                slashcommand.addStringOption(stringoption => {
                    return setStandardOptions(stringoption, option);
                });
            }else if(option.type == "CHANNEL"){
                slashcommand.addChannelOption(channeloption => {
                    return setStandardOptions(channeloption, option);
                });
            }else if(option.type == "INTEGER"){
                slashcommand.addIntegerOption(integeroption => {
                    return setStandardOptions(integeroption, option);
                });
            }else if(option.type == "USER"){
                slashcommand.addUserOption(useroption => {
                    return setStandardOptions(useroption, option);
                });
            }else if(option.type == "ROLE"){
                slashcommand.addRoleOption(roleoption => {
                    return setStandardOptions(roleoption, option);
                });
            }else if(option.type == "SUB_COMMAND"){
                return slashcommand.addSubcommand(subcommand => {
                    subcommand.setName(option.name);
                    subcommand.setDescription(option.description);
                    option.options.forEach(option => {
                        if(option.type == "USER"){
                            subcommand.addUserOption(useroption => {
                                return setStandardOptions(useroption, option);
                            });
                        }else if(option.type == "STRING"){
                            subcommand.addStringOption(stringoption => {
                                return setStandardOptions(stringoption, option);
                            });
                        }else if(option.type == "CHANNEL"){
                            subcommand.addChannelOption(channeloption => {
                                return setStandardOptions(channeloption, option);
                            });
                        }else if(option.type == "INTEGER"){
                            subcommand.addIntegerOption(integeroption => {
                                return setStandardOptions(integeroption, option);
                            });
                        }else if(option.type == "USER"){
                            subcommand.addUserOption(useroption => {
                                return setStandardOptions(useroption, option);
                            });
                        }else if(option.type == "ROLE"){
                            subcommand.addRoleOption(roleoption => {
                                return setStandardOptions(roleoption, option);
                            });
                        }
                    });
                    return subcommand;
                });
            }else if(option.type == "SUB_COMMAND_GROUP"){
                return slashcommand.addSubcommandGroup(subcommandgroup => {
                    subcommandgroup.setName(option.name);
                    subcommandgroup.setDescription(option.description);
                    option.options.forEach(option => {
                        return subcommandgroup.addSubcommand(subcommand => {
                            subcommand.setName(option.name);
                            subcommand.setDescription(option.description);
                            option.options.forEach(option => {
                                if(option.type == "USER"){
                                    subcommand.addUserOption(useroption => {
                                        return setStandardOptions(useroption, option);
                                    });
                                }else if(option.type == "STRING"){
                                    subcommand.addStringOption(stringoption => {
                                        return setStandardOptions(stringoption, option);
                                    });
                                }else if(option.type == "CHANNEL"){
                                    subcommand.addChannelOption(channeloption => {
                                        return setStandardOptions(channeloption, option);
                                    });
                                }else if(option.type == "INTEGER"){
                                    subcommand.addIntegerOption(integeroption => {
                                        return setStandardOptions(integeroption, option);
                                    });
                                }else if(option.type == "USER"){
                                    subcommand.addUserOption(useroption => {
                                        return setStandardOptions(useroption, option);
                                    });
                                }else if(option.type == "ROLE"){
                                    subcommand.addRoleOption(roleoption => {
                                        return setStandardOptions(roleoption, option);
                                    });
                                }
                            });
                            return subcommand;
                        });
                    });
                    return subcommandgroup;
                });
            }
        });
        slashcollection.push(slashcommand);
    });
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
    console.log("Refreshing slash commands");
    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: slashcollection },
    );
    console.log("Refreshed slash commands");
};

client.once('ready', async () => {
    if (!client.application?.owner) await client.application?.fetch();
    if(process.env.DEBUG == "true"){
        client.commands.forEach(async (command) => {
            if(!command.options) command.options = [];
            if(!command.developerOnly) command.developerOnly = false;
            if(!command.setDMPermission) command.setDMPermission = false;
            let data = {
                name: command.name,
                description: command.description,
                options: command.options,
                setDMPermission: !command.setDMPermission,
                defaultPermission: !command.developerOnly
            };
            await (client.guilds.cache.get(process.env.SERVERID) ?? await client.guilds.fetch(process.env.SERVERID)).commands.create(data);
        });
    }else{
        refreshSlashCommands();
    }
    console.log('✔  '.green + colors.green(`Bot is ready | ${appversion}`));
    // client.user.setActivity(`V${appversion}`, { type: 'WATCHING' });
});


client.on('interactionCreate', async (interaction) => {
	if (interaction.type !== InteractionType.ApplicationCommand && !interaction.isButton() && interaction.type !== InteractionType.ModalSubmit && !interaction.type !== InteractionType.ContextMenu) return;
    // console.log(interaction);
	
    if (interaction.type === InteractionType.ApplicationCommand) {
        try{
            await client.commands.get(interaction.commandName).execute(interaction);
        }catch(err){
            console.log(`Command: ${interaction.commandName}, run by: ${interaction.user.username}#${interaction.user.discriminator} failed for the reason:`);
            console.log(err);
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    } else if (interaction.type === InteractionType.Button) {
        try{
            if (interaction.customId.startsWith("A")){
                var acceptedvar = interaction.customId.split("-");
                const user = await client.users.fetch(acceptedvar[1]).catch(console.error);
                const Game = acceptedvar[3];
                const URL = acceptedvar[4];
                // await interaction.deleteReply();
                let accepted = new EmbedBuilder()
                    .setColor("#00ff00")
                    .setTitle(`Suggestion Accepted | ${user.username}#${user.discriminator}`)
                    .addFields([
                        { name: 'User:', value: `<@${user.id}>`},
                        { name: 'Accepted:', value: `<@${interaction.user.id}>`},
                    ])
                    // .addField("User:", `<@${user.id}>`)
                    // .addField("Accepted:", `<@${interaction.user.id}>`)
                    // .addField("Game:", Game)
                // .addField("Channel:", "<#" + interaction.channel.id + ">")
                .setTimestamp()
                .setFooter({ text: `${footer}`, iconURL: `${client.user.avatarURL()}` });
                if(Game == ""){
                    // accepted.addField("Game:", "NULL");
                    accepted.addFields([ { name: "Game:", value: "NULL" } ]);
                }else{
                    // accepted.addField("Game:", Game);
                    accepted.addFields([ { name: "Game:", value: Game } ]);
                }
                if(URL == ""){
                    // accepted.addField("URL:", "NULL");
                    accepted.addFields([ { name: "URL:", value: "NULL" } ]);
                }else{
                    // accepted.addField("URL:", URL);
                    accepted.addFields([ { name: "URL:", value: URL } ]);
                }
                //edit the message
                await interaction.message.edit({ embeds: [accepted], components: [] });
                await interaction.reply({ content: `Accept message sent to <@${user.id}>`, ephemeral: true });
                //send a dm message
                await user.send({ content: `Your Suggestion has been accepted: ${Game}` });
            }else if (interaction.customId.startsWith("D")){
                var declinedvar = interaction.customId.split("-");
                const user = await client.users.fetch(declinedvar[1]).catch(console.error);
                const Game = declinedvar[3];
                const URL = declinedvar[4];
                // await interaction.deleteReply();
                //declined embed
                let declined = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle(`Suggestion Declined | ${user.username}#${user.discriminator}`)
                    .addFields([
                        { name: 'User:', value: `<@${user.id}>`},
                        { name: 'Declined:', value: `<@${interaction.user.id}>`},
                    ])
                    // .addField("User:", `<@${user.id}>`)
                    // .addField("Declined:", `<@${interaction.user.id}>`)
                    // .addField("Game:", Game)
                // .addField("Channel:", "<#" + interaction.channel.id + ">")
                .setTimestamp()
                .setFooter({ text: `${footer}`, iconURL: `${client.user.avatarURL()}` });
                if(Game == ""){
                    // declined.addField("Game:", "NULL");
                    declined.addFields([ { name: "Game:", value: "NULL" } ]);
                }else{
                    // declined.addField("Game:", Game);
                    declined.addFields([ { name: "Game:", value: Game } ]);
                }
                if(URL == ""){
                    // declined.addField("URL:", "NULL");
                    declined.addFields([ { name: "URL:", value: "NULL" } ]);
                }else{
                    // declined.addField("URL:", URL);
                    declined.addFields([ { name: "URL:", value: URL } ]);
                }
                //edit the message
                await interaction.message.edit({ embeds: [declined], components: [] });
                await interaction.reply({ content: `Decline message sent to <@${user.id}>`, ephemeral: true });
                //send a dm message
                await user.send({ content: `Your Suggestion has been declined: ${Game}` });
            }else{
                await interaction.reply({ content: "ERROR", ephemeral: true });
            }
        }catch(err){
            console.log(`Command: button press, run by: ${interaction.user.username}#${interaction.user.discriminator} failed for the reason: ${err}`);
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    } else if (interaction.type === InteractionType.ModalSubmit) {
        try{
            var AnnouncementSplit = interaction.customId.split("-");
            const AnnouncementText = interaction.fields.getTextInputValue('announceText');
            const AnnouncementType = AnnouncementSplit[1];
            const AnnouncementChannel = AnnouncementSplit[2];

            if(AnnouncementType == "normal"){
                var AnnouncementType2 = "📜 General Announcement";
                var AnnouncementPing2 = config.normal;
            }else if(AnnouncementType == "prison"){
                var AnnouncementType2 = "👮 Prison Announcement - "+interaction.user.username;
                var AnnouncementPing2 = config.prison || config.normal;
            }else if(AnnouncementType == "skyblock"){
                var AnnouncementType2 = "🌌 Skyblock Announcement - "+interaction.user.username;
                var AnnouncementPing2 = config.skyblock || config.normal;
            }else if(AnnouncementType == "es"){
                var AnnouncementType2 = "⚔️ ES Announcement - "+interaction.user.username;
                var AnnouncementPing2 = config.es || config.normal;
            }else{
                var AnnouncementType2 = "An Announcement - "+interaction.user.username;
                var AnnouncementPing2 = config.normal;
            }

            const Announcement = new EmbedBuilder()
                .setColor(randomHex())
                .setTitle(AnnouncementType2)
                .setDescription(AnnouncementText)
                .setTimestamp()
                .setFooter({ text: footer });
            client.channels.cache.get(AnnouncementChannel).send({ content: `<@&${AnnouncementPing2}>`, embeds: [Announcement] }).then(message => message.react("❤️"));
            interaction.reply({ content: "Announcement sent", ephemeral: true})
        }catch(err){
            console.log(`Command: Modal, run by: ${interaction.user.username}#${interaction.user.discriminator} failed for the reason: ${err}`);
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    } else if (interaction.type === InteractionType.ContextMenu){
        try{
            if (interaction.customId == "suggest"){
                const row = new ActionRowBuilder()
                .addComponents(
                new ButtonBuilder()
                    .setCustomId('Accept')
                    .setLabel('Accept')
                    .setStyle('SUCCESS')
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Deny')
                    .setLabel('Deny')
                    .setStyle('DANGER')
                    .setDisabled(true)
            );
            const Game = interaction.fields.getTextInputValue('GameName');
            var Suggest = new EmbedBuilder()
                .setColor("#ff8c00")
                .setTitle("Suggestion | " + interaction.user.username + "#" + interaction.user.discriminator)
                .addFields([
                    { name: 'User:', value: `<@${interaction.user.id}>`},
                    { name: 'Game:', value: Game},
                ])
                // .addField("User:", "<@" + interaction.user.id + ">")
                // .addField("Game:", Game)
                // .addField("Channel:", "<#" + interaction.channel.id + ">")
                .setTimestamp()
                .setFooter({ text: `${footer}`, iconURL: `${client.user.avatarURL()}` });
            client.channels.cache.get(process.env.AUDITID).send({ content: `<@&${process.env.STAFFROLE}>`, embeds: [Suggest], components: [row] });
            interaction.reply({ content: "Your suggestion has been sent to staff", ephemeral: true});
            }
        }catch(err){
            console.log(`Command: , run by: ${interaction.user.username}#${interaction.user.discriminator} failed for the reason: ${err}`);
            await interaction.reply({ content: "Something went wrong", ephemeral: true });
        }
    }
});





setInterval(() => {
    // https://api.mcsrvstat.us/2/${servers.ip}
    // https://mcapi.us/server/status?ip=${servers.ip}
    // https://eu.mc-api.net/v3/server/ping/${servers.ip}

    console.log(colors.cyan("updating... | " + new Date()));
    client.channels.cache.get(process.env.CHANNELID).messages.fetch(process.env.MESSAGEID).then(message => {
        message.channel.sendTyping()
        var serverList = "";
        mcServers.forEach(servers => {
            // serverList = serverList + `**${servers.name}** | '${servers.ip}'\n`;
            superagent.get(`https://eu.mc-api.net/v3/server/ping/${servers.ip}`).then(res => {
                maxplayers = res.body.players.max;
                nowplayers = res.body.players.online;
                if (res.body.online) {
                    // serverList = serverList + `**${servers.name}** | <:Tick:867432833063452733>\n`;
                    serverList = serverList + `**${servers.name}:** <:Tick:867432833063452733> ${nowplayers}/${maxplayers}\n**Info:** ${servers.info}\n\n`;
                } else {
                    // serverList = serverList + `**${servers.name}** | <:Cross:867432869814075462>\n`;
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n**Info:** ${servers.info}\n\n`;
                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8", {'flags': 'r+'}))

            if(!prefixes[message.guild.id]){
                prefixes[message.guild.id] = {
                    prefixes: config.prefix
                };
            }

            let prefix = prefixes[message.guild.id].prefixes;

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`https://mcshowdown.afuxy.com`)
                .setLabel("Website")
            )
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(`https://status.afuxy.com/report/uptime/6b0fd145e0300b8f2b0e14da8ee1703b/`)
                .setLabel("Status")
            );
            const Status = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('Server Status')
            .setDescription(`**IP:** mcs.afuxy.com\n**VERSIONS:** \`1.19 - 1.19.1\`\n**BEDROCK:** \`1.19.21\`\n\n`+serverList+`\n**This updates every 10 minutes**`)
            // .addField('Servers', serverList)
            const HowToJoin = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('How To Join')
            .setDescription(`Use the command\n**/bedrock**: to get info on how to join through console,mobile or pc\n**/java**: to get info on how to join through java`)
            .setTimestamp()
            .setFooter({ text: footer });
            // send embed
            message.edit({ embeds: [Status, HowToJoin], components: [row] });
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
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n**Info:** ${servers.info}\n\n`;                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            // console.log(serverList);
            const Status = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('Server Status')
            .setDescription(`**IP:** mcs.afuxy.com\n**VERSIONS:** \`1.19 - 1.19.1\`\n**BEDROCK:** \`1.19.21\``)
            // .setDescription(`**IP:** mcs.afuxy.com\n**VERSIONS:** \`1.19 - 1.19.1\`\n**BEDROCK:** We support the latest version\n\n`+serverList)
            // .addField('Servers', serverList)
            .addFields([
                { name: 'Servers', value: serverList },
            ])
            .setTimestamp()
            .setFooter({ text: footer });
            // send embed
            message.channel.send({ embeds: [Status] });
        }, mcServers.length * 1e3);
    }

    // help command
    // if (message.content === prefix+'help') {
    //     message.channel.sendTyping()
    //     const Help = new EmbedBuilder()
    //     .setColor(randomHex())
    //     .setTitle('Help')
    //     .addField(`**${prefix}help**`, '`For this list of commands`', true)
    //     .addField(`**${prefix}status**`, '`For the live server status`', true)
    //     .addField(`**${prefix}bedrock**`, '`A help command for joining the server from bedrock`', true)
    //     .addField(`**${prefix}java**`, '`A help command for joining the server from java`', true)
    //     .addField(`** **`, '**Minecraft staff commands**')
    //     .addField(`**${prefix}announce**`, '`General announcements, mostly won\'t be used by anyone.`', true)
    //     .addField(`**${prefix}pannounce**`, '`Prison announements, will be mostly used by DarkMatter`', true)
    //     .addField(`**${prefix}esannounce**`, '`ES announements, will be mostly used by IHaveCleanToes`', true)
    //     .addField(`**${prefix}sbannounce**`, '`Skyblock announements, will be mostly used by PIE`', true)
    //     .addField(`** **`, '**Event staff commands**')
    //     .addField(`**${prefix}eannounce**`, '`Event announcements, will be used by the event staff`', true)
    //     .addField(`**~~${prefix}startevent~~**`, '`Start an event with a simple command`', true)
    //     .setTimestamp()
    //     .setFooter({ text: footer });
    //     // send embed
    //     message.channel.send({ embeds: [Help] });
    // }

    // setprefix
    // if (message.content.startsWith(prefix+'setprefix')) {
    //     // if (!message.author.id === '200612445373464576') return message.channel.send(`${message.author.username} You do not have permission to use this command!`);
    //     if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || !message.author.id === '200612445373464576') return message.channel.send(`${message.author.username}, You do not have permission to use this command!`);
    //     let newPrefix = message.content.split(' ').slice(1, 2)[0];
    //     prefixes[message.guild.id] = {
    //         prefixes: newPrefix
    //     };
    //     fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
    //         if (err) console.log(err)
    //     });
    //     message.channel.send(`${message.author.username} Prefix has been set to ${newPrefix}`);
    //     client.guilds.cache.get(message.guildId).members.cache.get(client.user.id).setNickname(client.user.username + ' (' + newPrefix+ ')');
    // }

    // when ating the bot send a message
    // if (message.content.includes(client.user.id)) {
    //     message.channel.sendTyping()
    //     const embed = new EmbedBuilder()
    //     .setColor(randomHex())
    //     .setDescription("**The prefix is** `"+prefix+"`\nDo `"+prefix+"help` for more info")
    //     // .setTimestamp()
    //     // .setFooter({ text: footer });
    //     message.channel.send({ embeds: [embed] });
    // }

    // make custom announcements
    // if (message.content.startsWith(prefix+'announce')) {
    //     //only people with a role can use this command
    //     if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
    //     // if (message.author.id === '200612445373464576') {
    //         const args = message.content.substring(prefix.length).split(" ");
    //         // const command = args.shift().toLowerCase();
    //         const announcement = args.slice(1).join(" ");
    //         const attachment = message.attachments.first();
    //         const url = attachment ? attachment.url : null;
    //         if (announcement.length < 1) {
    //             message.channel.send('Please enter a message to announce.');
    //         } else {
    //             // embed
    //             const Announcement = new EmbedBuilder()
    //             .setColor(randomHex())
    //             .setTitle('📜 General Announcement')
    //             .setDescription(announcement)
    //             .setTimestamp()
    //             .setFooter({ text: footer });
    //             // send embed
    //             if (url) Announcement.setImage(url);
    //             message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' }).then(message => message.react("❤️"));
    //             // delete message after sending
    //             message.delete();
    //         }
    //     } else {
    //         message.delete();
    //         message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
    //     }
    // }


    // if (message.content.startsWith(prefix+'pannounce')) {
    //     //only people with a role can use this command
    //     if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
    //     // if (message.author.id === '200612445373464576') {
    //         const args = message.content.substring(prefix.length).split(" ");
    //         // const command = args.shift().toLowerCase();
    //         const announcement = args.slice(1).join(" ");
    //         const attachment = message.attachments.first();
    //         const url = attachment ? attachment.url : null;
    //         if (announcement.length < 1) {
    //             message.channel.send('Please enter a message to announce.');
    //         } else {
    //             // embed
    //             const Announcement = new EmbedBuilder()
    //             .setColor('#FFFF55')
    //             .setTitle('👮 Prison Announcement - '+message.author.username)
    //             .setDescription(announcement)
    //             .setTimestamp()
    //             .setFooter({ text: footer });
    //             // send embed
    //             if (url) Announcement.setImage(url);
    //             message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' }).then(message => message.react("❤️"));
    //             // delete message after sending
    //             message.delete();
    //         }
    //     } else {
    //         message.delete();
    //         message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
    //     }
    // }

    // if (message.content.startsWith(prefix+'esannounce')) {
    //     //only people with a role can use this command
    //     if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
    //     // if (message.author.id === '200612445373464576') {
    //         const args = message.content.substring(prefix.length).split(" ");
    //         // const command = args.shift().toLowerCase();
    //         const announcement = args.slice(1).join(" ");
    //         const attachment = message.attachments.first();
    //         const url = attachment ? attachment.url : null;
    //         if (announcement.length < 1) {
    //             message.channel.send('Please enter a message to announce.');
    //         } else {
    //             // embed
    //             const Announcement = new EmbedBuilder()
    //             .setColor('#FFAA00')
    //             .setTitle('⚔️ Enhanced Survival Announcement - '+message.author.username)
    //             .setDescription(announcement)
    //             .setTimestamp()
    //             .setFooter({ text: footer });
    //             // send embed
    //             if (url) Announcement.setImage(url);
    //             message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' }).then(message => message.react("❤️"));
    //             // delete message after sending
    //             message.delete();
    //         }
    //     } else {
    //         message.delete();
    //         message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
    //     }
    // }

    // if (message.content.startsWith(prefix+'sbannounce')) {
    //     //only people with a role can use this command
    //     if (!message.member.roles.cache.has(parseInt(process.env.ANNOUNCEROLE))) {
    //     // if (message.author.id === '200612445373464576') {
    //         const args = message.content.substring(prefix.length).split(" ");
    //         // const command = args.shift().toLowerCase();
    //         const announcement = args.slice(1).join(" ");
    //         const attachment = message.attachments.first();
    //         const url = attachment ? attachment.url : null;
    //         if (announcement.length < 1) {
    //             message.channel.send('Please enter a message to announce.');
    //         } else {
    //             // embed
    //             const Announcement = new EmbedBuilder()
    //             .setColor('#FF5555')
    //             .setTitle('🌌 Skyblock Announcement - '+message.author.username)
    //             .setDescription(announcement)
    //             .setTimestamp()
    //             .setFooter({ text: footer });
    //             // send embed
    //             if (url) Announcement.setImage(url);
    //             message.channel.send({ embeds: [Announcement], content: '<@&950857941228077057>' }).then(message => message.react("❤️"));
    //             // delete message after sending
    //             message.delete();
    //         }
    //     } else {
    //         message.delete();
    //         message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
    //     }
    // }

    // if (message.content.startsWith(prefix+'eannounce')) {
    //     //only people with a role can use this command
    //     if (!message.member.roles.cache.has(parseInt(process.env.EVENTANNOUNCEROLE))) {
    //     // if (message.author.id === '200612445373464576') {
    //         const args = message.content.substring(prefix.length).split(" ");
    //         // const command = args.shift().toLowerCase();
    //         const announcement = args.slice(1).join(" ");
    //         const attachment = message.attachments.first();
    //         const url = attachment ? attachment.url : null;
    //         if (announcement.length < 1) {
    //             message.channel.send('Please enter a message to announce.');
    //         } else {
    //             // embed
    //             const Announcement = new EmbedBuilder()
    //             .setColor('#00AA00')
    //             .setTitle('🎧 Event Announcement - '+message.author.username)
    //             .setDescription(announcement)
    //             .setTimestamp()
    //             .setFooter({ text: footer });
    //             // send embed
    //             if (url) Announcement.setImage(url);
    //             message.channel.send({ embeds: [Announcement], content: '<@&778046989048741918>' }).then(message => message.react("❤️"));
    //             // delete message after sending
    //             message.delete();
    //         }
    //     } else {
    //         message.delete();
    //         message.channel.send(`${message.author.username}, You do not have permission to use this command!`)
    //     }
    // }

    // create an event


    // help command from bedrock players
    // if (message.content.startsWith(prefix+'bedrock')) {
    //     const Bedrock = new EmbedBuilder()
    //     .setColor(randomHex())
    //     .setTitle('📜 Bedrock Players Help')
    //     .addField("Xbox one", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#xbox-one")
    //     .addField("Switch", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#nintendo-switch")
    //     .addField("Playstation 4", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#playstation-4")
    //     .addField("Other ways", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#alternative-methods")
    //     .setDescription("\n**If you need anymore help you can always contact a minecraft staff member.**\n")
    //     .setFooter({ text: footer });
    //     message.channel.send({ embeds: [Bedrock] });
    // }

    // if (message.content.startsWith(prefix+'java')) {
    //     const Bedrock = new EmbedBuilder()
    //     .setColor(randomHex())
    //     .setTitle('📜 Java Players Help')
    //     .setDescription('Coming soon!')
    //     .setFooter({ text: footer });
    //     message.channel.send({ embeds: [Bedrock] });
    // }

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
        const Guilds = new EmbedBuilder()
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
    if(message.content == '^stats') {
        message.channel.sendTyping()
        cpuStat.usagePercent(function(err, percent, seconds) {
			if (err) {
				return console.log(err);
			}

			var duration = moment
				.duration(client.uptime)
				.format(" D [days], H [hrs], m [mins], s [secs]");
			var Stats = new EmbedBuilder()
				.setTitle("*** Stats ***")
				.setColor("#C0C0C0")
				// .addField("• Mem Usage",`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,true)
				// .addField("• Uptime ", `${duration}`, true)
				// .addField("• Discord.js", `v${version}`, true)
				// .addField("• Node", `${process.version}`, true)
                // .addField("• Carlos", `\`v${appversion}\``, true)
				// .addField("• CPU",`\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
				// .addField("• CPU usage", `\`${percent.toFixed(2)}%\``, true)
				// .addField("• Arch", `\`${os.arch()}\``, true)
				// .addField("• Platform", `\`\`${os.platform()}\`\``, true)
                .addFields([
                    { name: '• Mem Usage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
                    { name: '• Uptime ', value: `${duration}`, inline: true },
                    { name: '• Carlos', value: `\`v${appversion}\``, inline: true },
                    { name: '• CPU', value: `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``, inline: true },
                    { name: '• CPU usage', value: `\`${percent.toFixed(2)}%\``, inline: true },
                    { name: '• Arch', value: `\`${os.arch()}\``, inline: true },
                    { name: '• Platform', value: `\`\`${os.platform()}\`\``, inline: true }
                ])
				.setFooter({ text: footer });
                message.channel.send({ embeds: [Stats] });
            });
    }


    // reply to a user when the message they send contains the ip
    // if (message.content.endsWith('ip') || message.content.startsWith('ip') || message.content.endsWith('ip?') || message.content.startsWith('ip?') || message.content.startsWith(prefix+'ip')) {
    //     if(message.channel.id === "975851931895488512" || message.channel.id === "956221589773516882") {
    //         message.reply(`The server IP is: \`mcs.afuxy.com\``);
    //     }
    // }


});





// get the token from the .env file
client.login(process.env.TOKEN);