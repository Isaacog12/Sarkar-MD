/**
dev note :{
this antidelet code coded by mr wasi  kindly give credits 
**/
import antidelete from './king/Sarkar/antidelete.js'; // Import the antidelete handler
import config from '../config.cjs';

const botOwnerNumber = config.OWNER_NUMBER; // Bot owner number from config

// Object to manage active chats
const activeAntiDeleteChats = new Set();

const handleCommand = async (msg, sock) => {
   const command = msg.body?.toLowerCase(); // Get the command from the message body
   const chatId = msg.key.remoteJid; // Get the chat ID

   // Command to activate antidelete
   if (command === 'antidelete on') {
      activeAntiDeleteChats.add(chatId); // Add chat to active list
      await sock.sendMessage(chatId, { text: 'Anti-delete is now active in this chat.' });
      console.log(`Anti-delete activated in chat: ${chatId}`);
   }

   // Command to deactivate antidelete
   else if (command === 'antidelete off') {
      activeAntiDeleteChats.delete(chatId); // Remove chat from active list
      await sock.sendMessage(chatId, { text: 'Anti-delete is now inactive in this chat.' });
      console.log(`Anti-delete deactivated in chat: ${chatId}`);
   }
};

// Main event listener
const mainHandler = async (msg, sock) => {
   const chatId = msg.key.remoteJid;

   // Check for commands
   if (msg.body) {
      await handleCommand(msg, sock);
   }

   // Check if anti-delete is active for the chat
   if (activeAntiDeleteChats.has(chatId)) {
      await antidelete(msg, sock); // Use the imported antidelete handler
   }
};

export default mainHandler;
