const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "sc",
  version: "2.0.6",
  hasPermission: 0,
  credits: "Jonell Magallanes",
  description: "Play a song from SoundCloud",
  commandCategory: "utility",
  usages: "[title]",
  usePrefix: true,
  cooldowns: 1
};

module.exports.run = async ({ api, event, args }) => {
  const search = args.join(" ");

  try {
    if (!search) {
      return api.sendMessage("Please provide a title to search for.", event.threadID);
    }

    const findingMessage = await api.sendMessage(`Searching for "${search}"...`, event.threadID);

    const soundCloudSearchUrl = `https://soundcloud-hshs.onrender.com/sc?query=${search}`;
    const searchResponse = await axios.get(soundCloudSearchUrl);
    
    const url = searchResponse.data[0].url;

    const soundCloudTrackUrl = `https://soundcloud-music-player-by-jonell.onrender.com/sc?search=${encodeURIComponent(search)}`;
    const trackResponse = await axios.get(soundCloudTrackUrl, {
      responseType: 'arraybuffer'
    });

    const cacheDir = path.join(__dirname, 'cache');
    const fileName = `${Date.now()}.mp3`;
    const filePath = path.join(cacheDir, fileName);

    fs.ensureDirSync(cacheDir);

    fs.writeFileSync(filePath, Buffer.from(trackResponse.data));

    api.sendMessage({
      body: `Here's your music from SoundCloud 🎵\nTrack Url: ${url}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    api.unsendMessage(findingMessage.messageID);
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('An error occurred while processing the command.', event.threadID);
  }
};
