const config = require("./config");
const Irc = require("irc");
const Discord = require("discord.io");

// init stuff
const irc = new Irc.Client("irc.oftc.net", "glua-steam", {
  channels: ["#ariasteam"]
});
const discord = new Discord.Client({
  token: config.token,
  autorun: true
});

// message queues
var d = []; //messages to be sent to discord
var i = []; //messages to be sent to irc



discord.on("ready", () => {
  console.log("[DISCORD]" + discord.username + " - (" + discord.id + ") started!");
});

irc.on("registered", message => {
  console.log("[IRC] Bot started!");
});

// Recieve listeners
discord.on("message", (user, userid, channelid, message, event) => {
  if(channelid == 152162730244177920 && userid !== discord.id)
    i.push("<" + user + "> " + message);
});

irc.on("message", (nick, to, text, message) => {
  d.push("<" + nick + "> " + text);
});


//send loops

//discord messages
var dprocessing = false; // am i trying to send a message?
setInterval(() => {
  if(dprocessing) return;
  if(d.length > 0) {
    var message = d.shift();
    dprocessing = true;
    discord.sendMessage({
      to: 152162730244177920,
      message: message
    }, (err, res) => {
      console.log("[IRC] " + message);
      dprocessing = false;
      if(err) console.error(err);
    });
  }
}, 250);


// irc messages
var iprocessing = false; // am i trying to send a message?
setInterval(() => {
  if(iprocessing) return;
  if(i.length > 0) {
    var message = i.shift();
    iprocessing = true;
    irc.say("#ariasteam", message);
    console.log("[DISCORD] " + message);
    iprocessing = false;    
  }
});

