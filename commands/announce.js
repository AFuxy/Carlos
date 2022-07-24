const {
    EmbedBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ApplicationCommandOptionType,
    ChannelType
} = require("discord.js");
module.exports = {
    "name": "announce",
    "description": "Announce minecraft stuff",
    "options": [
        {
            name: 'announcetype',
            description: 'What type of announcement do you want to make?',
            type: ApplicationCommandOptionType.String,
            choices: [
                {name: 'Normal', value: 'normal'}
            ],
            required: true
        },
        {
            name: 'channel',
            description: 'What channel do you want to announce in?',
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText, ChannelType.GuildNews],
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
            // var channelType = interaction.options.getChannel("channel").type;
            // if (channelType == ChannelType.GuildText || channelType == ChannelType.GuildNews){
                const modal = new ModalBuilder()
			        .setCustomId(`announcement-${interaction.options.getString("announcetype")}-${interaction.options.getChannel("channel").id}`)
			        .setTitle('What do you want to send?');
                const announceText = new TextInputBuilder()
			        .setCustomId('announceText')
			        .setLabel("Give us your best announcement!")
			        .setStyle(TextInputStyle.Paragraph);
                const Text = new ActionRowBuilder().addComponents(announceText);
                modal.addComponents(Text);
		        await interaction.showModal(modal);
            // }else{
            //     await interaction.reply({ content: "Channel does not exist", ephemeral: true });
            // }
        }
    }
}