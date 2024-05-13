const axios = require('axios');
const fs = require('fs').promises;

let totalRequests = 0;

module.exports.config = {
    name: "llma",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "EDUCATIONAL",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const apiUrl = `https://jonellccapisproject-e1a0d0d91186.herokuapp.com/api/meta?inputText=${content}`;
    
    totalRequests++;

    if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

    try {
        api.sendMessage("🔍 | LLMA AI is searching for your answer. Please wait...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const { response: reply } = response.data;

        api.sendMessage(`${reply}\n\n📝 Users Request: ${totalRequests}`, event.threadID, event.messageID);
        await saveTotalRequestsToJson();
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

module.exports.getTotalRequests = () => {
    return { totalRequests };
};

async function saveTotalRequestsToJson() {
    const data = { totalRequests };
    try {
        await fs.writeFile('totalRequests.json', JSON.stringify(data, null, 2));
        console.log('Total requests saved to totalRequests.json');
    } catch (error) {
        console.error('Error saving total requests to JSON file:', error);
    }
}
