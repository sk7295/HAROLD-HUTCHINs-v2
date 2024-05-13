const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "aminfo",
  version: "1.0",
  hasPermssion: 0,
  credits: "Jonell Magallanes",
  description: "getting the info of Alightlinkinfo presets",
  usePrefix: true,
  commandCategory: "No Prefix",
  usage: " ",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body !== null && event.isGroup) {
    const linkMatch = event.body.match(/https?:\/\/alight\.link\/([a-zA-Z0-9]+)/);
    
    if (linkMatch) {
      const link = linkMatch[0];
      axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/am?alightlink=${encodeURIComponent(link)}`)
        .then(async (response) => {
          const { title, ogImage, ogDescription, importLink } = response.data;
          const pathie = './cache/am.jpg';
          const writeStream = fs.createWriteStream(pathie);
          
          const imgResponse = await axios.get(ogImage, { responseType: 'stream' });
          imgResponse.data.pipe(writeStream);
          api.setMessageReaction("✅", event.messageID, () => { }, true);
          writeStream.on('finish', () => {
            const message = `📁 𝗔𝗹𝗶𝗴𝗵𝘁𝗠𝗼𝘁𝗶𝗼𝗻 𝗚𝗲𝘁𝘁𝗲𝗿 𝗜𝗻𝗳𝗼\n\n𝗧𝗶𝘁𝗹𝗲: ${title}\n\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${ogDescription}\n\n𝗔𝗹𝗶𝗴𝗵𝘁𝗟𝗶𝗻𝗸: ${importLink}`;
            api.sendMessage({
              body: message,
              attachment: fs.createReadStream(pathie)
            }, event.threadID);
          });
        })
        .catch(error => {
          console.error('Error fetching link info:', error);
        });
    }
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("📝 | This command automatically scan the info of alightlink and created the cmd by jonell Magallanes haha", event.threadID);
};
