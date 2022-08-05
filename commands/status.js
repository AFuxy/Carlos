const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const superagent = require('superagent');
const randomHex = require('../app.js');
module.exports = {
    "name": "status",
    "description": "Show all servers status",
    "setDMPermission": false,
    async execute(interaction){
        await interaction.deferReply();
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
                    serverList = serverList + `**${servers.name}:** <:Cross:867432869814075462>\n**Info:** ${servers.info}\n\n`;                }
            }, err => {
                console.log(err);
            });
        });
        //wait till foreach has finished
        setTimeout(() => {
            // console.log(serverList);
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
                .setURL(`https://status.afuxy.com`)
                .setLabel("Status")
            );
            const Status = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('Server Status')
            .setDescription(`**IP:** mcs.afuxy.com\n**VERSIONS:** \`1.19\`\n**BEDROCK:** \`1.19.10\``)
            // .setDescription(`**IP:** mcs.afuxy.com\n**VERSIONS:** \`1.19\`\n**BEDROCK:** We support the latest version\n\n`+serverList)
            // .addField('Servers', serverList)
            .addFields([
                { name: 'Servers', value: serverList }
            ])
            .setTimestamp()
            .setFooter({ text: footer });
            // send embed
            interaction.editReply({ embeds: [Status], components: [row], ephemeral: true });
        }, mcServers.length * 1e3);
    }
}