import fetch from 'node-fetch';
import fs from 'fs';
import { createWriteStream } from 'fs';
import config from './config.cjs';

// Extract prefix from config
const { prefix } = config;

// API keys
const GOOGLE_API_KEY = 'AIzaSyDebFT-uY_f82_An6bnE9WvVcgVbzwDKgU';
const GOOGLE_CX = '45b94c5cef39940d1';

// Command Handler
export async function handleImageCommand(command, args, reply, sendMedia) {
  const validCommands = ['image', 'img', 'gimage'];
  
  if (!validCommands.includes(command)) {
    reply(`Invalid command! Use: ${validCommands.map(cmd => `${prefix}${cmd}`).join(', ')}`);
    return;
  }

  if (args.length === 0) {
    reply(`Please provide a search query. Example: ${prefix}image cat`);
    return;
  }

  const query = args.join(' ');
  reply('Searching for the image...');

  try {
    // Google Custom Search API Endpoint
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=1`;
    
    // Fetch the image data
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      reply('No image found for the given query.');
      return;
    }

    // Get the first image URL
    const imageUrl = data.items[0].link;

    // Download the image
    const imagePath = `./downloads/${Date.now()}.jpg`;
    const res = await fetch(imageUrl);
    const fileStream = createWriteStream(imagePath);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on('error', reject);
      fileStream.on('finish', resolve);
    });

    // Send the downloaded image
    await sendMedia(imagePath, `Here is your image for: *${query}*`);
    
    // Clean up the downloaded file
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error(error);
    reply('An error occurred while fetching the image.');
  }
}
export default gimage;
