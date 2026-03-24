const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken('DISCORD_TOKEN');

(async () => {
  try {
    console.log('🔄 Registriere Slash Commands...');

    await rest.put(
      Routes.applicationCommands('1479971937546666107'),
      { body: commands }
    );

    console.log('✅ Slash Commands registriert!');
  } catch (error) {
    console.error(error);
  }
})();
