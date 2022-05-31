import DiscordJS, { Intents, MessageAttachment, MessageEmbed } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

// prefix to call bot with.
let prefix = ','

// "Permissions" registry
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('The bot is ready')
})

// Fired when a message is sent in the guild (discord server)
client.on('messageCreate', (message) => {
    
    // Checks for valid bot prefix in message.
    // Terminates if not found.
    if (!isBotCall(message.content)) {
        return;
    }

    // Checks if message is from a bot.
    // Terminates if true
    if (message.author.bot) {
        return
    }

    // Debug var
    let argDeb = message.content.indexOf(' ')
    // Isolate command from potential sub-args
    let arg0 = getCommandArg(message.content)

    // Command registry
    switch (arg0) {
        case 'repeat':
            const img = null
            if (message.attachments.size > 0) {
                const img = message.attachments.first()
                message.reply('image detected')
            }
            message.reply({
                content: '\u200B' + img
            })
            break
        case 'cheese':
            message.reply({
                content: 'that is my favorite food',
            })
            break
        case 'ping':
            message.reply({
                content: 'pong! ' + message.author.toString(),
            })
            break
        case 'pfp':
            message.reply({
                content: message.author.displayAvatarURL()
            })
            break
        case 'subarg':
            message.reply({
                content: getCommandSubargs(message.content)
                
            })
            break
        case 'picture':
            let n = 0
            let images:string[] = []
            message.attachments.forEach(attachment => {
                const ImageLink = attachment.proxyURL;
                images[n] = ImageLink
                n++
                message.reply({ files: [ImageLink] })
            });
            message.reply({ files: [images[0]]})
            //let attachment = message.attachments.first()?.url
            //message.reply({
            //    content: 'Here: ' + message.attachments.first()?.proxyURL
            //})
            break
        case 'suggest':
            const embed = new MessageEmbed()
	            .setColor('#fad378')
	            //.setTitle('Suggestion')
	            //.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL()})
	            //.setDescription('Some description here')
	            //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	            .addFields(
	            	{ name: 'Submitter', value: message.author.tag},
                    { name: 'Suggestion', value: 'HELLO'},
	            	//{ name: '\u200B', value: '\u200B' },
	            	//{ name: 'Inline field title', value: 'Some value here', inline: true },
	            	//{ name: 'Inline field title', value: 'Some value here', inline: true },
            	)
	            //.addField('Inline field title', 'Some value here', true)
	            //.setImage(message.attachments.for)
	            .setTimestamp()
	            .setFooter({ text: 'User ID: ' + message.author.id, iconURL: message.author.displayAvatarURL() });
            message.reply({
                embeds: [embed]
            })
        default:
            message.reply({
                content: 'arg0 read as: ' + arg0 + '\n' +
                         'argDeb read as: ' + argDeb + '\n' +
                         'Sender: '
                         
            })
            break
    }

    if (message.content.at(0) === prefix + 'test') {

        message.reply({
            content: message.author.toString(),
        })
    }

})

client.login(process.env.TOKEN)

// Takes a string and sees if the first character matches the prefix
function isBotCall(userMessage: string): boolean {
    if (userMessage.at(0) === prefix) {
        return true
    }
    return false
}

// Takes a string and returns in the string format of a "command argument"
//   - String input loses its prefix (first char) for return.
//   - String input is split at first or no space for return.
function getCommandArg(userMessage: string): string {
    if (userMessage.indexOf(' ') === -1) {
        return userMessage.substring(1, userMessage.length)
    }
    return userMessage.substring(1, userMessage.indexOf(' '))
}

// Takes a string and returns its "command sub-arguments"
//   - All content after first space is returned as a string.
//   - Input must have a space char, or return is empty.
function getCommandSubargs(userMessage: string): string {
    let firstSpace = userMessage.indexOf(' ')
    if (firstSpace === -1) {
        return ''
    }
    return userMessage.substring(firstSpace + 1, userMessage.length)
}