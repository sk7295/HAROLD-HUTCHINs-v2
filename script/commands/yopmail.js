const axios = require('axios');

module.exports.config = {
    name: "yopmail",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Generate and read emails",
    usePrefix: false,
    commandCategory: "emails",
    usages: "[action] [email_address]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("Please provide an action (generate or read) and an email address if necessary.", event.threadID, event.messageID);

    const action = args[0].toLowerCase();

    try {
        if (action === 'create') {
            const response = await axios.get('https://yopmail-haha.onrender.com/create');
            const { email } = response.data;
            api.sendMessage(`📧 Generated email:\n\n${email}`, event.threadID, event.messageID);
        } else if (action === 'read' && args[1]) {
            const email_address = args[1];
            const response = await axios.get(`https://yopmail-haha.onrender.com/mes?read=${email_address}`);
            const { inbox } = response.data;
            if (inbox.length > 0) {
                const { from, subject, timestamp } = inbox[0];
                api.sendMessage(`📩 Email from: ${from}\nSubject: ${subject}\nTimestamp: ${timestamp}`, event.threadID, event.messageID);
            } else {
                api.sendMessage(`📩 No email found for address: ${email_address}`, event.threadID, event.messageID);
            }
        } else {
            api.sendMessage("Invalid action. Please use 'generate' or 'read'.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
