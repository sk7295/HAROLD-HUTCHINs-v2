const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

module.exports.config = {
    name: "reminder",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Set, replace or clear reminders",
    usePrefix: true,
    commandCategory: "other",
    usages: "[action] [reminder text]",
    cooldowns: 10
};

module.exports.run = function ({ api, event, args }) {
    const action = args[0];
    const reminderText = args.slice(1).join(" ");
    const threadID = event.threadID;
    const remindersFile = path.join(__dirname, 'reminders.json');

    // Load existing reminders from the database
    let reminders = {};
    if (fs.existsSync(remindersFile)) {
        reminders = JSON.parse(fs.readFileSync(remindersFile, 'utf8'));
    }

    switch (action) {
        case 'set':
            setReminder(threadID, reminderText);
            api.sendMessage(`Successfully Reminder Recorded on ThreadID ${threadID}`, threadID);
            break;

        case 'replace':
            replaceReminder(threadID, reminderText);
            api.sendMessage(`Successfully replaced`, threadID);
            break;

        case 'clear':
            clearReminder(threadID);
            api.sendMessage(`Successfully cleared`, threadID);
            break;

        default:
            api.sendMessage(`Invalid action. Use 'set', 'replace', or 'clear'`, threadID);
            break;
    }

    function setReminder(threadID, text) {
        const nextReminderTime = getNextReminderTime();
        reminders[threadID] = {
            text,
            nextReminder: nextReminderTime
        };
        saveReminders();
        scheduleReminder(threadID, text, nextReminderTime);
    }

    function replaceReminder(threadID, text) {
        if (reminders[threadID]) {
            // Cancel the existing cron job
            cron.cancelJob(`thread-${threadID}`);
            
            const nextReminderTime = getNextReminderTime();
            reminders[threadID] = {
                text,
                nextReminder: nextReminderTime
            };
            saveReminders();
            scheduleReminder(threadID, text, nextReminderTime);
        }
    }

    function clearReminder(threadID) {
        if (reminders[threadID]) {
            // Cancel the existing cron job
            cron.cancelJob(`thread-${threadID}`);
            
            delete reminders[threadID];
            saveReminders();
        }
    }

    function saveReminders() {
        fs.writeFileSync(remindersFile, JSON.stringify(reminders));
    }

    function scheduleReminder(threadID, text, nextReminderTime) {
        cron.schedule(`*/3 * * * *`, () => {
            sendReminder(threadID, text);
        }, {
            scheduled: true,
            timezone: 'Asia/Manila',
            id: `thread-${threadID}`
        });
    }

    function sendReminder(threadID, text) {
        api.sendMessage(`🔔 | Reminders for all Members \n\n${text}\n\nThis Reminder Send Every 5 mins`, threadID);
    }

    function getNextReminderTime() {
        const now = new Date();
        const nextReminderTime = new Date(now.getTime() + 3 * 60000); // 3 minutes in milliseconds
        return nextReminderTime;
    }
};
