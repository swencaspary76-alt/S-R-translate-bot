const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder 
} = require('discord.js');

const fs = require('fs');
const fetch = require('node-fetch');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===== Daten laden =====
let data = { users: {} };
if (fs.existsSync('./data.json')) {
    data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
}

function saveData() {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

// ===== Übersetzungsfunktion =====
async function translate(text, target) {
    try {
        const res = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: target,
                format: 'text'
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        return json.translatedText;
    } catch (err) {
        console.error('Übersetzungsfehler:', err);
        return text;
    }
}

// ===== Dashboard erstellen =====
function createDashboard(userId) {
    const user = data.users[userId] || { lang: null, active: false };

    const embed = new EmbedBuilder()
        .setTitle('🌍 Übersetzungs-Dashboard')
        .setDescription(
            `Sprache: ${user.lang || 'Nicht gesetzt'}\n` +
            `Status: ${user.active ? '🟢 Aktiv' : '🔴 Inaktiv'}`
        )
        .setColor(0x00AE86);

    const menu = new StringSelectMenuBuilder()
        .setCustomId('lang_select')
        .setPlaceholder('Sprache auswählen')
        .addOptions([
            { label: 'Deutsch', value: 'de' },
            { label: 'Englisch', value: 'en' },
            { label: 'Spanisch', value: 'es' },
            { label: 'Französisch', value: 'fr' },
            { label: 'Italienisch', value: 'it' }
        ]);

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('activate')
            .setLabel('Aktivieren')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('deactivate')
            .setLabel('Deaktivieren')
            .setStyle(ButtonStyle.Danger)
    );

    return {
        embeds: [embed],
        components: [
            new ActionRowBuilder().addComponents(menu),
            buttons
        ]
    };
}

// ===== Bot ready =====
client.once('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

// ===== Slash Command und Interaktionen =====
client.on('interactionCreate', async interaction => {

    // /translate
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'translate') {
            if (!data.users[interaction.user.id]) {
                data.users[interaction.user.id] = { lang: null, active: false };
                saveData();
            }

            await interaction.reply({
                ...createDashboard(interaction.user.id),
                ephemeral: true
            });
        }
    }

    // Dropdown Auswahl
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'lang_select') {
            const lang = interaction.values[0];
            data.users[interaction.user.id].lang = lang;
            saveData();

            await interaction.update(createDashboard(interaction.user.id));
        }
    }

    // Buttons
    if (interaction.isButton()) {
        const user = data.users[interaction.user.id];

        if (interaction.customId === 'activate') {
            user.active = true;
        }

        if (interaction.customId === 'deactivate') {
            user.active = false;
        }

        saveData();
        await interaction.update(createDashboard(interaction.user.id));
    }
});

// ===== Auto-Übersetzung =====
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const user = data.users[message.author.id];
    if (!user || !user.active || !user.lang) return;

    const translated = await translate(message.content, user.lang);
    if (translated.toLowerCase() === message.content.toLowerCase()) return;

    await message.reply(`🌍 ${translated}`);
});

// ===== Bot Login =====
client.login(process.env.DISCORD_TOKEN);
