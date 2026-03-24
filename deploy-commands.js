const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1479971937546666107';

if (!token) {
  console.error('❌ DISCORD_TOKEN ist nicht gesetzt.');
  process.exit(1);
}

if (!clientId) {
  console.error('❌ DISCORD_CLIENT_ID ist nicht gesetzt.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔄 Registriere Slash Commands...');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('✅ Slash Commands registriert!');
  } catch (error) {
    console.error('❌ Fehler beim Registrieren der Slash Commands:', error);
    process.exit(1);
  }
})();
