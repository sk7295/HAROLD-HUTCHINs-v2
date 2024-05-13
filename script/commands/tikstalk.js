const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "tikstalk",
  version: "1.0.",
  hasPermssion: 0,
  credits: "Jonell Magallanes",
  description: "TikTok user info",
  commandCategory: "Media",
  usePrefix: false,
  usages: "[TikTok username]",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const pathie = './cache/enhanced.jpg';
  const { threadID, messageID } = event;

  const tiktokUsername = args.join(" ");

  try {
    api.sendMessage("⏱️ | Fetching TikTok user info. Please Wait....", threadID, messageID);

    const response = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/tikstalk?unique_id=${tiktokUsername}`);
    const tiktokData = response.data;

    const imgResponse = await axios.get(tiktokData.avatarLarger, { responseType: "stream" });

    const writeStream = fs.createWriteStream(pathie);
    imgResponse.data.pipe(writeStream);

    writeStream.on('finish', () => {
      const anonymizedSecUid = "secret ********"; // Anonymized secUid
      const userInfo = `𝗜𝗗: ${tiktokData.id}\n𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${tiktokData.nickname}\n𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${tiktokData.username}\n𝗕𝗶𝗼: ${tiktokData.signature}\n𝗦𝗲𝗰𝗨𝗶𝗱: ${anonymizedSecUid}\n𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻: ${tiktokData.relation}\n𝗩𝗶𝗱𝗲𝗼𝘀: ${tiktokData.videoCount}\n𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${tiktokData.followingCount}\n𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${tiktokData.followerCount}\n𝗟𝗶𝗸𝗲𝘀: ${tiktokData.heartCount}\n𝗗𝗶𝗴 𝗖𝗼𝘂𝗻𝘁: ${tiktokData.diggCount}`;

      api.sendMessage({
        body: `👤 | 𝗧𝗶𝗸𝘁𝗼𝗸 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗨𝘀𝗲𝗿\n\n${userInfo}`,
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    });
  } catch (error) {
    api.sendMessage(`❎ | Error fetching TikTok user info: ${error}`, threadID, messageID);
  }
};
