const {
    EmbedBuilder
} = require("discord.js");
const randomHex = require('../app.js');
module.exports = {
    "name": "java",
    "description": "Show some helpful join info for java",
    "setDMPermission": false,
    async execute(interaction){
        var Java = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('📜 Java Players Help')
            // .addField("IP", "mcs.afuxy.com")
            .addFields([
                { name: 'IP', value: 'mcs.afuxy.com' },
            ])
            .setDescription('Coming soon!')
            .setFooter({ text: footer });
        await interaction.reply({ embeds: [Java], ephemeral: true });
    }
}