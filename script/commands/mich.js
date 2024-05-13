const axios = require('axios');
const fs = require('fs');

let chatEnabled = {};

if (fs.existsSync('./chatbotStatusMich.json')) {
    const rawData = fs.readFileSync('./chatbotStatusMich.json');
    chatEnabled = JSON.parse(rawData);
}

module.exports.config = {
    name: "mich",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Chating With Mich Malakas yung tuyo ng babae neto",
    usePrefix: false,
    commandCategory: "Chatbot",
    usages: "[on/off]",
    cooldowns: 3
};

function saveStatus() {
    fs.writeFileSync('./chatbotStatusMich.json', JSON.stringify(chatEnabled, null, 2));
}

module.exports.run = async function ({ api, event, args }) {
    const command = args[0];
    
    if (command === 'on') {
        chatEnabled[event.threadID] = true;
        saveStatus();
        return api.sendMessage("Chatbot is now ON", event.threadID, event.messageID);
    }

    if (command === 'off') {
        chatEnabled[event.threadID] = false;
        saveStatus();
        return api.sendMessage("Chatbot is now OFF", event.threadID, event.messageID);
    }

    if (!chatEnabled[event.threadID]) return;

    const content = encodeURIComponent(args.join(" "));
    const id = event.senderID;

    if (!content) return api.sendMessage("Hello There I'm Mich Chatbot made by Jonell Magallanes Haha", event.threadID, event.messageID);
    
    try {
        const response = await axios.get(`https://michai-ec9807495fa2.herokuapp.com/mich?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer Jonell Magallanes Thanks", event.threadID);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!chatEnabled[event.threadID] || event.body === null || !event.isGroup) return;

    const content = encodeURIComponent(event.body);
    const id = event.senderID;

    try {
        const response = await axios.get(`https://michai-ec9807495fa2.herokuapp.com/mich?ask=${content}&id=${id}`);
        const { response: reply } = response.data;  
        api.sendMessage(reply, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Nagkaroon ng Error Sa Main Server ng API Please Try Again Later or Contact the Developer Jonell Magallanes Thanks", event.threadID);
    }
};
