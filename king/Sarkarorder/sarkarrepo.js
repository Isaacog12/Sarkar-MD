import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent } = pkg;
import axios from 'axios';

const handleRepoCommand = async (m, Matrix) => {
  try {
    // WhatsApp Channel and Group Links
    const channelLink = 'https://whatsapp.com/channel/0029VajGHyh2phHOH5zJl73P';
    const groupLink = 'https://chat.whatsapp.com/C5js5lDia5Y8dcAoXj4mpq';

    // VIP-Styled Message Text
    const messageText = `╭─❒ 「 *Sarkar-MD* 」 ❒──\n│\n│ *Hello, ${m.pushName}!*\n│\n│ Welcome to *Sarkar-MD,* a premium WhatsApp bot\n│ created by *Bandaheali.* This bot is packed with\n│ amazing features to enhance your experience!\n│\n╰───────────────────❒\n\n◈ *❲❒❳ Features & Info*\n\n*➤ WhatsApp Channel:*\n[Join Now](${channelLink})\n\n*➤ WhatsApp Group:*\n[Join Now](${groupLink})\n\n_Stay connected for updates, features,\nand premium services!_\n\n*© Powered by Sarkar-MD.*`;

    // Send the message
    await Matrix.sendMessage(m.from, { text: messageText }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error('Error processing your request:', error);
    m.reply('❌ Error processing your request.');
    await m.react('❌');
  }
};

const searchRepo = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[+×÷=/_<>[\]!@#.£%^&*()\-"'1234567890?,°€£^:;?¿‽】〕」』【〔「『<>_${}\|`《○♡○¡☆《●●■◇¡¤▪︎•°~♡●♧₩$€○》☆¡Abcdefghijklmonpqrstuvwxyz]/i);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['repo', 'sc', 'script'];

  if (validCommands.includes(cmd)) {
    await handleRepoCommand(m, Matrix);
  }
};

export default searchRepo;
