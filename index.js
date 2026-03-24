const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  console.warn('⚠️  commands/ Verzeichnis nicht gefunden – erstelle es automatisch...');
  fs.mkdirSync(commandsPath, { recursive: true });
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Command geladen: ${command.data.name}`);
  } else {
    console.warn(`⚠️  Überspringe ${file} – fehlende 'data' oder 'execute' Eigenschaft`);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot ist online als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Fehler beim Ausführen von /${interaction.commandName}:`, error);
      const reply = { content: '❌ Fehler beim Ausführen des Befehls.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
