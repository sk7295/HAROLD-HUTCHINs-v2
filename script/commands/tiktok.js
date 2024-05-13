module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kim Joseph DG Bien",
  description: "tiktok search",
  usePrefix: true,
  commandCategory: "tiktok",
  usage: "[Tiktok <search>]",
  cooldowns: 30,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      api.sendMessage("Usage: tiktok <search text>", event.threadID);
      return;
    }

    const ser = await api.sendMessage(`Tiktok Search\n━━━━━━━━━━━━━━━━━━\nSearching: ${searchQuery}`, event.threadID);

    const response = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
    const videos = response.data.data.videos;

    if (!videos || videos.length === 0) {
      api.sendMessage("No videos found for the given search query.", event.threadID);
      return;
    }

    const videoData = videos[0];
    const founded = `📝 | Tiktok Search\n━━━━━━━━━━━━━━━━━━\nResult Found!`;
    api.editMessage(founded, ser.messageID, event.threadID);
    const videoUrl = videoData.play;
    const message = `Tiktok Result:\n\nPosted by: ${videoData.author.nickname}\nUsername: ${videoData.author.unique_id}\n\nTitle: ${videoData.title}`;

    const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream'
    });

    videoResponse.data.pipe(writer);

    writer.on('finish', () => { 
      const almost = `Tiktok Search\n━━━━━━━━━━━━━━━━━━\nAlmost There 📥`
      api.sendMessage({
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          const sent = `✅ | Tiktok Successfully Sent!\n━━━━━━━━━━━━━━━━━━\n\n${message}`;
          api.editMessage(sent, ser.messageID, event.threadID);
          fs.unlinkSync(filePath);
        }
      );
    });
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("An error occurred while processing the request.", event.threadID);
  }
};
