require('dotenv').config();
const events = require('events');
const tmi = require('tmi.js');
const uuid = require('uuid');

export interface ChatListener {
    command: string,
    callback: (channel: string, tags: any, commands: Array<string>) => void,
}

export interface TwitchBot {
    messageHandlers: Map<string, ChatListener>,
    client: any,
    init: () => void,
    say: (message: string, channel: string) => void,
    addListener: (action: ChatListener) => string,
    joinChannel: (channel: string) => void,
    removeEvent: (id: string) => void,
    handleMessage: (channel: string, tags: Array<string>, message: string, self: any) => void,
}

const twitchBot: TwitchBot = module.exports = {
    messageHandlers: new Map<string, ChatListener>(),
    client: new tmi.client({
        connection: {
            reconnect: true,
            secure: true
        },
        options: {
            debug: true
        },
        identity: {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD
        },
        channels: null
    }),
    say: (message: string, channel: string) => {
        twitchBot.client.say(channel, message);
    },
    init: () => {
        twitchBot.client.on('message', twitchBot.handleMessage);
        twitchBot.client.on('connected', (addr: any, port: any) => console.log(`* Connected to ${addr}:${port}`));
        twitchBot.client.connect();
    },
    joinChannel: (channel: string) => {
        if (twitchBot.client.channels.indexOf(`#${channel}`) !== -1) return;
        twitchBot.client.join(`#${channel}`).then(() => {
            return;
        }).catch((err: any) => {
            console.log('Join error: ', err);
            return;
        })
    },
    addListener: (action: ChatListener) => {
        const newID = uuid.v4();
        twitchBot.messageHandlers.set(newID, action);
        return newID;
    },
    removeEvent: (id: string) => {
        twitchBot.messageHandlers.delete(id)
    },
    handleMessage: (channel: string, tags: any, message: string, self: any) => {
        if (self) { return; } // Ignore messages from the bot
        let commands: Array<string>, commandName: string;
        try {
            commands = message.trim().split(' ');
            commandName = commands.length != 0 ? commands[0] : '';
        } catch (e) { console.log(e); return; }

        twitchBot.messageHandlers.forEach((msgHandler: ChatListener) => {
            if (commandName == msgHandler.command) msgHandler.callback(channel, tags, commands)
        })
    }
}