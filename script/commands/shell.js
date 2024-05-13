const { exec } = require('child_process');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

module.exports.config = {
    name: "shell",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Jonell Magallanes",
    description: "Execute shell terminal with images",
    usePrefix: true,
    commandCategory: "Utility",
    usages: "[command]",
    cooldowns: 10
};

const executeAndRender = async (command, api, event) => {
    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
            return;
        }

        const backgroundImageUrl = 'https://i.postimg.cc/Pq1TzKDJ/New-Project-1305-C3-AEA76.png'; // Replace with your custom background image URL

        try {
            const bgImage = await loadImage(backgroundImageUrl);

            
            const aspectRatio = bgImage.width / bgImage.height;

            const width = 1080;
            const height = width / aspectRatio;


           
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.font = '24px "Courier New", Courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

 
            const lines = stdout.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, canvas.width / 2, (canvas.height / 2) + (index - (lines.length / 2)) * 30);
            });

            
            const out = fs.createWriteStream(__dirname + '/result.png');
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => {
                console.log('The PNG file was created.');
                api.sendMessage({
                    attachment: fs.createReadStream(__dirname + '/result.png'),
                    body: `🖥️ | Executed Terminal Result!\n${stdout}`
                }, event.threadID);
            });
        } catch (error) {
            console.error('Error processing image:', error);
            api.sendMessage("An error occurred while processing the image.", event.threadID);
        }
    });
};

module.exports.run = async function ({ api, event, args }) {
    const command = args.join(" ");

    if (!command) return api.sendMessage("Please provide a command.", event.threadID, event.messageID);

    try {
        api.sendMessage("🔍 | Executing command. Please wait...", event.threadID, event.messageID);
        executeAndRender(command, api, event);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
