const {
    MessageEmbed
} = require("discord.js");
const randomHex = require('../app.js');
module.exports = {
    "name": "java",
    "description": "Show some helpful join info for java",
    "setDMPermission": false,
    async execute(interaction){
        var Java = new MessageEmbed()
            .setColor(randomHex())
            .setTitle('📜 Java Players Help')
            .setDescription('Coming soon!')
            .setFooter({ text: footer });
        await interaction.reply({ embeds: [Java], ephemeral: true });
    }
}