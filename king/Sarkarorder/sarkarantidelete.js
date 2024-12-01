import config from '../../config.cjs';

// Main command function
const antideleteCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'antidelete') {
    if (!isCreator) return m.reply("*Only admin*");
    let responseMessage;

    if (text === 'on') {
      config.ANTIDELETE = true;
      responseMessage = "Anti-Delete has been enabled.";
    } else if (text === 'off') {
      config.ANTIDELETE = false;
      responseMessage = "Anti-Delete has been disabled.";
    } else {
      responseMessage = "Usage:\n- `antidelete on`: Enable Anti-Delete\n- `antidelete off`: Disable Anti-Delete";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

// Anti-Delete handler
const antideleteHandler = async (message, Matrix) => {
  if (!config.ANTIDELETE) return;

  // Check if the message is deleted
  if (message.messageStubType === 'REVOKE') {
    const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
    const messageContent = message.message;

    try {
      await Matrix.sendMessage(ownerJid, { 
        text: `A message was deleted:\n\n- From: ${message.key.participant || message.key.remoteJid}\n- Group: ${message.key.remoteJid || 'Private chat'}` 
      });

      // Forward the deleted message to the owner
      if (messageContent) {
        await Matrix.forwardMessage(ownerJid, message);
      }
    } catch (error) {
      console.error("Error forwarding deleted message:", error);
    }
  }
};

export { antideleteCommand, antideleteHandler };
