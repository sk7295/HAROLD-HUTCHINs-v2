const axios = require('axios');

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes",
  description: "chat with bot",
  usePrefix: true,
  commandCategory: "chat",
  usages: "bot [your message]",
  cooldowns: 10
};

module.exports.run = async ({ api, event, args }) => {
  const message = args.join(" ") || "hi";
  api.setMessageReaction("✅", event.messageID, () => { }, true);
  
  if (!args[0]) {
    api.sendMessage("Please input your message", event.threadID, event.messageID);
    api.setMessageReaction("🗨️", event.messageID, () => { }, true);
    return;
  }

  const apiUrl = `https://sim-api-vtid.onrender.com/sim?query=${encodeURIComponent(message)}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.respond) {
      api.sendMessage(response.data.respond, event.threadID, event.messageID);
      api.setMessageReaction("❤️", event.messageID, () => { }, true);
    } else {
      api.sendMessage("Unable to get a response from the bot.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error making API Call:', error);
    api.sendMessage('An error occurred while talking to the bot.', event.threadID, event.messageID);
    api.setMessageReaction("😥", event.messageID, () => { }, true);
  }
};
