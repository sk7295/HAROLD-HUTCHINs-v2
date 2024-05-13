const axios = require('axios');

module.exports.config = {
    name: "iplocator",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "IP Locator",
    usePrefix: false,
    commandCategory: "other",
    usages: "[ip]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    
    if (!content) return api.sendMessage("Please provide a valid IP address.\n\nExample: iplocator 111.90.225.96", event.threadID, event.messageID);

    const apiUrl = `https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/ip?ipnum=${content}`;

    try {
        api.sendMessage("🔍 | Locating IP address. Please wait...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const { data } = response.data;

        if (data && data.success) {
            const {
                ip, type, continent, country, region, city, latitude, longitude,
                org, isp, timezone, currency, currency_symbol
            } = data;

            const replyMessage = `ℹ️ IP Information:\n
📫 IP: ${ip}
🛰️ Type: ${type}
🗾 Continent: ${continent}
🌏 Country: ${country}
🗺️ Region: ${region}
📍 City: ${city}
🔍 Coordinates: ${latitude}, ${longitude}
🛰️ Organization: ${org}
📝 ISP: ${isp}
⏰ Timezone: ${timezone}
💵 Currency: ${currency} (${currency_symbol})`;

            api.sendMessage(replyMessage, event.threadID, event.messageID);
        } else {
            api.sendMessage("Invalid IP address or unable to fetch information.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
