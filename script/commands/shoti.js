module.exports.config = {
  name: "shoti",
  version: "1.0.0",
  credits: "shoti-api",
  description: "Generate random TikTok girl videos",
  hasPermssion: 0,
  commandCategory: "other",
  usage: "[shoti]",
  cooldowns: 5,
  dependencies: [],
  usePrefix: true,
};

module.exports.run = async function ({ api, event }) {
  try {
    const axios = require("axios");
    const fs = require("fs");
    const { createWriteStream } = require("fs");
    const request = require("request");

    const waiting = await api.sendMessage("⏱️ | Shoti is Searching Please Wait...\n━━━━━━━━━━━━━━━━━━\nUsername: 🔍 Searching", event.threadID, event.messageID);

    let response = await axios.post(
      "https://shoti-srv1.onrender.com/api/v1/get",
      {
        apikey: "$shoti-1htmjrc5eqotij71lso", // Replace "YOUR_API_KEY_HERE" with your actual API key
      },
    );

    if (response.data.code !== 200) {
      api.sendMessage(
        `API ERROR: ${response.data}`,
        event.threadID,
        event.messageID,
      );
      return;
    }

    const founded = `🔗 | Shoti Fetched \n━━━━━━━━━━━━━━━━━━\nUsername: @${response.data.data.user.username}`;
    await api.editMessage(founded, waiting.messageID, event.threadID);

    const file = createWriteStream(__dirname + "/cache/shoti.mp4");
    const rqs = request(encodeURI(response.data.data.url));
    rqs.pipe(file);    
    file.on("finish", () => {
      const almost = `Shoti Sending\n━━━━━━━━━━━━━━━━━━\nUsername: @${response.data.data.user.username}\n\nAlmost There 📥`;
      api.editMessage(almost, waiting.messageID, event.threadID);
      api.sendMessage({
        attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4"),
      }, event.threadID, () => {
        const sent = `✅ | Shoti Successfully Sent\n━━━━━━━━━━━━━━━━━━\nUsername: @${response.data.data.user.username}`;
        api.editMessage(sent, waiting.messageID, event.threadID);
      });
    });

    file.on("error", (err) => {
      api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
    });
  } catch (error) {
    api.sendMessage(
      "An error occurred while generating video: " + error,
      event.threadID,
      event.messageID,
    );
  }
};
