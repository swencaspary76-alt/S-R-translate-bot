const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Übersetze Text')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text zum Übersetzen')
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('text');

    const menu = new StringSelectMenuBuilder()
      .setCustomId('language-select')
      .setPlaceholder('🌍 Sprache wählen')
      .addOptions([
        { label: 'Deutsch', value: 'de' },
        { label: 'Englisch', value: 'en' },
        { label: 'Spanisch', value: 'es' },
        { label: 'Italienisch', value: 'it' },
        { label: 'Französisch', value: 'fr' },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: 'Wähle die Zielsprache:',
      components: [row],
      ephemeral: true
    });

    const filter = i =>
      i.customId === 'language-select' &&
      i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000
    });

    collector.on('collect', async i => {
      const lang = i.values[0];

      try {
        const res = await axios.post('https://libretranslate.de/translate', {
          q: text,
          source: 'auto',
          target: lang,
          format: 'text'
        });

        await i.update({
          content: `📢 Übersetzung:\n${res.data.translatedText}`,
          components: []
        });
      } catch (err) {
        await i.update({
          content: '❌ Fehler bei der Übersetzung',
          components: []
        });
      }
    });
  }
};
