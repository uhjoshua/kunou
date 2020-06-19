const Discord = require(`discord.js`);
const package = require(`./package.json`);
const randomImage = require(`./utils/randomImage.js`)

const client = new Discord.Client();

client.login(package.token);
client.on('ready', () =>{
    console.log(`${client.user} ${client.user.username} has started with:
> ${client.users.size} users     
> in ${client.channels.size} channels   
> across ${client.guilds.size} guilds.
    
======================`);   
    client.user.setActivity(`!help`);
});

client.on(`message`, m =>{
    if(!m.content.startsWith(package.prefix))
        return;
    if(commands.hasOwnProperty(m.content.toLowerCase().slice(package.prefix.length).split(` `)[0]))
        commands[m.content.toLowerCase().slice(package.prefix.length).split(` `)[0]](m);
});

let queue = {};

const commands = {
    'help': (m) =>{
        let embedUtil = new Discord.RichEmbed()
            .setTitle(`Utility Commands`)
            .setColor(0x206694)
//===============================================================================================
            .setDescription(`**help:** Displays this page
**avatar <mention>:** Embeds the mentioned users avatar
**r <subreddit>:** Embeds a random image from the speficied subreddit
**roll: <sides>** Rolls a die
**prune:** Deletes the last 100 messages, younger than 14 days. NEEDS MANAGE MESSAGES PERM`)
//===============================================================================================
            .setTimestamp()
        m.channel.send(embedUtil);
    },

    'avatar': (m) =>{
        var user = m.mentions.users.last();
        if(m.content === `${package.prefix}avatar`){
            let embedAvatar = new Discord.RichEmbed()
                .setTitle(`${m.author.username}'s avatar`)
                .setColor(0x206694)
                .setImage(m.author.avatarURL)
                .setTimestamp()
            m.channel.send(embedAvatar);
        }else if(user === undefined){
            m.channel.send(`please mention someone`)
        }else{
            let embedAvatar = new Discord.RichEmbed()
                .setTitle(`${user.username}'s avatar`)
                .setColor(0x206694)
                .setImage(user.avatarURL)
                .setTimestamp()
            m.channel.send(embedAvatar);
        }
    },

    'prune': (m) =>{
        if(!m.member.hasPermission(`MANAGE_MESSAGES`)){
            let embedDenied = new Discord.RichEmbed()
                .setTitle(`**denied** ${m.author.username}`)
                .setColor(0x206694)
                .setTimestamp()
            m.delete().catch(O_o =>{});
            m.channel.send(embedDenied)
        }else{
            m.channel.fetchMessages({
                limit: 100
            }).then(messages => m.channel.bulkDelete(messages));
            let embedPruned = new Discord.RichEmbed()
                .setTitle(`chat **pruned** by ${m.author.username}`)
                .setColor(0x206694)
                .setTimestamp()
            m.channel.send(embedPruned).then(sentMessage => {
                sentMessage.delete(3000)});
        }
    },

    'r': (m) =>{
        var subreddit = m.content.split(` `)[1].toUpperCase();
        randomImage(subreddit)
            .then(url =>{
                switch(true){
                    case url.endsWith(`.gif`):
                    case url.endsWith(`.gifv`):
                    case url.endsWith(`.mp4`):
                        m.channel.send(url); break;
                    default:
                        let embed = new Discord.RichEmbed()
                            .setTitle(`${m.author.username} requested r/${subreddit}: ${url}`)
                            .setColor(0x206694)
                            .setImage(url)
                            .setTimestamp()
                        m.channel.send(embed); break;
                }
            });
    },
    
    'roll': (m) =>{
        var sides = m.content.split(` `)[1];
        if(sides === null){
            sides = 6;
        }else{
            let embedRoll = new Discord.RichEmbed()
                .setTitle(`**${m.author.username}** rolled a **${~~(Math.random() * sides) + 1}**`)
                .setColor(0x206694)
                .setTimestamp()
            m.channel.send(embedRoll)
        }
    },

    'suspend': (m) =>{
        switch(m.author.id){
            case "163378051692888064":
                let embedEnd = new Discord.RichEmbed()
                    .setTitle(`**suspended**`)
                    .setTimestamp()
                    .setColor(0x206694)
                m.channel.send(embedEnd)
                    .then(console.log(`session end`));
                setTimeout(function(){
                    process.exit(1);
                }, 500); break;
            default:
                let embedDenied = new Discord.RichEmbed()
                    .setTitle(`**denied** ${m.author.username}`)
                    .setTimestamp()
                    .setColor(0x206694)
                m.channel.send(embedDenied); break;
        }
    },
}