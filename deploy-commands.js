const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  console.error('❌ commands/ Verzeichnis nicht gefunden. Bitte stelle sicher, dass Commands vorhanden sind.');
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️  Überspringe ${file} – fehlende 'data' oder 'execute' Eigenschaft`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registriere Slash Commands...');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID || '1479971937546666107'),
      { body: commands }
    );

    console.log('✅ Slash Commands registriert!');
  } catch (error) {
    console.error(error);
  }
})();
