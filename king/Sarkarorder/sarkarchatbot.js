import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed with `npm install node-fetch`

// Main command function
const chatbotCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'chatbot') {
    if (!isCreator) return m.reply("*Only admin*");
    let responseMessage;

    if (text === 'on') {
      config.CHAT_BOT = true;
      responseMessage = "Chatbot has been enabled.";
    } else if (text === 'off') {
      config.CHAT_BOT = false;
      responseMessage = "Chatbot has been disabled.";
    } else {
      responseMessage = "Usage:\n- `chatbot on`: Enable Chatbot\n- `chatbot off`: Disable Chatbot";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }

  if (config.CHAT_BOT && !cmd) {
    try {
      const apiResponse = await fetch(`https://www.dark-yasiya-api.site/ai/chatgpt?q=${encodeURIComponent(m.body)}`);
      const jsonResponse = await apiResponse.json();

      if (jsonResponse.response) {
        await Matrix.sendMessage(m.from, { text: jsonResponse.response }, { quoted: m });
      } else {
        await Matrix.sendMessage(m.from, { text: "Sorry, I couldn't understand that." }, { quoted: m });
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      await Matrix.sendMessage(m.from, { text: 'Error fetching chatbot response.' }, { quoted: m });
    }
  }
};

export default chatbotCommand;
