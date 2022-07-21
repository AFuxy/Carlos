const {
    MessageEmbed,
    MessageActionRow,
    Modal,
    TextInputComponent
} = require("discord.js");
module.exports = {
    "name": "announce",
    "description": "Announce minecraft stuff",
    "options": [
        {
            name: 'announcetype',
            description: 'What type of announcement do you want to make?',
            type: 'STRING',
            choices: [
                {name: 'Normal', value: 'normal'}
            ],
            required: true
        },
        {
            name: 'channel',
            description: 'What channel do you want to announce in?',
            type: 'CHANNEL',
            required: true
        }
    ],
    "setDMPermission": false,
    async execute(interaction){
        if (interaction.member.roles.cache.some(r => r.id === parseInt(process.env.ANNOUNCEROLE))){
            interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true });
            return;
        }else{
            // console.log(interaction.options.getChannel("channel"));
            // return;
            var channelType = interaction.options.getChannel("channel").type;
            if (channelType == "GUILD_TEXT" || channelType == "GUILD_NEWS"){
                const modal = new Modal()
			        .setCustomId(`announcement-${interaction.options.getString("announcetype")}-${interaction.options.getChannel("channel").id}`)
			        .setTitle('What do you want to send?');
                const announceText = new TextInputComponent()
			        .setCustomId('announceText')
			        .setLabel("Give us your best announcement!")
			        .setStyle('PARAGRAPH');
                const Text = new MessageActionRow().addComponents(announceText);
                modal.addComponents(Text);
		        await interaction.showModal(modal);
            }else{
                await interaction.reply({ content: "Channel does not exist", ephemeral: true });
            }
        }
    }
}