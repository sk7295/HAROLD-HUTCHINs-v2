const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "checkweb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Checks the status of a website for error codes or OK status",
    usePrefix: false,
    commandCategory: "other",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const url = args[0];

    if (!url) return api.sendMessage("Please provide a website URL to check.\n\nExample: checkweb https://example.com", event.threadID, event.messageID);

    try {
        api.sendMessage(`🔍 | The Result of your website ${url}. Please wait...`, event.threadID, event.messageID);

        const apiUrl = `https://webapibyjonell-80677d08ae83.herokuapp.com/web?url=${url}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const dir = './cache';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const filename = path.join(dir, `website_status_${Date.now()}.png`);
        fs.writeFileSync(filename, response.data);

        api.sendMessage({
            body: `📫 | The Result of your website ${url}`,
            attachment: fs.createReadStream(filename)
        }, event.threadID, () => fs.unlinkSync(filename));
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while checking the website status.", event.threadID);
    }
};
