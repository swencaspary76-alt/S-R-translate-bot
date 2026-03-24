const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('translate').setDescription('Öffnet das Übersetzungs-Dashboard').toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registriere Slash-Commands...');
    if (!process.env.CLIENT_ID) throw new Error('CLIENT_ID ist nicht gesetzt.');

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log('Guild commands registered.');
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('Global commands registered.');
    }
  } catch (err) {
    console.error('Fehler beim Registrieren der Commands:', err);
  }
})();