const axios = require('axios').default;

module.exports.config = {
	name: "shoutout",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Jonell Magallanes",
	description: "free shoutout with bot",
    usePrefix: false,
	usage: "[your shoutout text]",
	commandCategory: "social",
	cooldowns: 60,
};
 
module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
	var accessToken = "EAAAAUaZA8jlABO5bQZCZBYKIiGDqTbCl3YX6CDBLOwyENPM4dHGDX0qfKQmZB4sF4piZCRZCU7vVv21zmYJch7GnqAHEZCcyns4lA3l6qp9cEad71Lf7Gpst8eXXZAHuOC3fv3fBD1smZBGA7oPjv9u4ZBJ7WHQEmG7TMfzZAuYAOohyU2a1ZAI1N3YvZBZBgmhgSFnEliHgZDZD";

	var textToPost = args.join(" ");

	try {
		const postTitle = `➦ 𝙎𝙝𝙤𝙪𝙩𝙤𝙪𝙩 𝙁𝙧𝙤𝙢 𝘽𝙤𝙩 𝙐𝙨𝙚𝙧\n\n『 ${textToPost} 』`;
		const res = await axios.post(`https://graph.facebook.com/v12.0/me/feed?message=${encodeURIComponent(postTitle)}&access_token=${accessToken}`);
		
		console.log(res.data);
		api.sendMessage("📪 | Hey User Your ShoutOut Has been Posted! Check My profile to see your shoutout! Please wait 1 minute before shout out again.", event.threadID);
	} catch(err) {
		console.log(err);
		api.sendMessage("🚧 | Error while posting", event.threadID);
	}
};
