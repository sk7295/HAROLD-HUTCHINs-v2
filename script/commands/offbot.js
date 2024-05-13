module.exports.config = {
  name: "offbot",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "HTHB",
  description: "offbot",
  usePrefix: true,
  commandCategory: "system",
  cooldowns: 0
        };
module.exports.run = ({event, api}) =>api.sendMessage("offbot ✅",event.threadID, () =>process.exit(0))
