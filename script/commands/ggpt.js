const axios = require('axios');
const fs = require('fs').promises;

const storageFile = 'user_data.json';
const chatRecordFile = 'chat_records.json';

module.exports.config = {
    name: "ggpt",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATIONAL",
    usePrefix: false,
    commandCategory: "other",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const uid = event.senderID;
    const apiUrl = `https://cc-project-apis-jonell-magallanes.onrender.com/api/globalgpt?content=${content}`; // Updated API URL

    if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

    try {
        api.sendMessage("🔍 | GlobalGPT is searching for your answer. Please wait...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const { content: result, requestCount } = response.data; // Updated response structure

        // Update user data
        const userData = await getUserData(uid);
        userData.requestCount = (userData.requestCount || 0) + 1;
        userData.responses = userData.responses || [];
        userData.responses.push({ question: content, response: result });
        await saveUserData(uid, userData);

        // Record chat
        recordChat(uid, content);

        // Get total request count and list of users who asked questions
        const totalRequestCount = await getTotalRequestCount();
        const userNames = await getUserNames(api, uid);

        // Generate response
        const responseMessage = `${result}\n\n📝 Request Count: ${requestCount}\n👤 Question Asked by: ${userNames.join(', ')}`;
        api.sendMessage(responseMessage, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

async function getUserData(uid) {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData[uid] || {};
    } catch (error) {
        return {};
    }
}

async function saveUserData(uid, data) {
    try {
        const existingData = await getUserData(uid);
        const newData = { ...existingData, ...data };
        const allData = await getAllUserData();
        allData[uid] = newData;
        await fs.writeFile(storageFile, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

async function getTotalRequestCount() {
    try {
        const allData = await getAllUserData();
        return Object.values(allData).reduce((total, userData) => total + (userData.requestCount || 0), 0);
    } catch (error) {
        return 0;
    }
}

async function getUserNames(api, uid) {
    try {
        const userInfo = await api.getUserInfo([uid]);
        return Object.values(userInfo).map(user => user.name || `User${uid}`);
    } catch (error) {
        console.error('Error getting user names:', error);
        return [];
    }
}

async function getAllUserData() {
    try {
        const data = await fs.readFile(storageFile, 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        return {};
    }
}

function recordChat(uid, question) {
    try {
        const chatRecords = getChatRecords();
        const userChat = chatRecords[uid] || [];
        userChat.push({ timestamp: Date.now(), question });
        chatRecords[uid] = userChat;
        fs.writeFile(chatRecordFile, JSON.stringify(chatRecords, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error recording chat:', error);
    }
}

function getChatRecords() {
    try {
        const data = fs.readFileSync(chatRecordFile, 'utf-8');
        return JSON.parse(data) || {};
    } catch (error) {
        return {};
    }
}
