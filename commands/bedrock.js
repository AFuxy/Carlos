const {
    EmbedBuilder
} = require("discord.js");
const randomHex = require('../app.js');
module.exports = {
    "name": "bedrock",
    "description": "Show some helpful join info for bedrock",
    "setDMPermission": false,
    async execute(interaction){
        var Bedrock = new EmbedBuilder()
            .setColor(randomHex())
            .setTitle('📜 Bedrock Players Help')
            // .addField("IP and Port", "IP: mcs.afuxy.com & Port: 25536")
            // .addField("Xbox one", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#xbox-one")
            // .addField("Switch", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#nintendo-switch")
            // .addField("Playstation 4", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#playstation-4")
            // .addField("Other ways", "https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#alternative-methods")
            .addFields([
                { name: 'IP and Port', value: 'IP: mcs.afuxy.com & Port: 25536' },
                { name: 'Xbox one', value: 'https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#xbox-one' },
                { name: 'Switch', value: 'https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#nintendo-switch' },
                { name: 'Playstation 4', value: 'https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#playstation-4' },
                { name: 'Other ways', value: 'https://wiki.geysermc.org/geyser/using-geyser-with-consoles/#alternative-methods' }
            ])
            .setDescription("\n**If you need anymore help you can always contact a minecraft staff member.**\n")
            .setFooter({ text: footer });
        await interaction.reply({ embeds: [Bedrock], ephemeral: true });
    }
}