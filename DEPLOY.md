# Deployment

Voraussetzungen:
- Node.js >= 18 (empfohlen) oder Node <18 + node-fetch@2
- Ein Discord-Bot-Token (DISCORD_TOKEN)
- CLIENT_ID (Anwendungs-/Client-ID)
- Optional: GUILD_ID (für Gilden-spezifische Registration während Entwicklung)

Installieren:

npm install

Umgebungsvariablen setzen (Linux/macOS):

export DISCORD_TOKEN="YOUR_TOKEN"
export CLIENT_ID="YOUR_CLIENT_ID"
export GUILD_ID="YOUR_GUILD_ID" # optional

Slash-Commands registrieren:

npm run deploy-commands

Bot starten:

npm start

Hinweise:
- Aktiviere den "Message Content Intent" im Discord Developer Portal, falls du messageCreate Inhalte verarbeiten willst.
- LibreTranslate (https://libretranslate.de) kann Rate-Limits haben – für Produktion eigenen Service/API-Key benutzen.
- Für Produktion empfehle ich PM2 oder Docker.
