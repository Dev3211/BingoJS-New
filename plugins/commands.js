var config = require("../config"),
    bot = new(require("./bot.js"))(),
    plugins = [];

class Commands {

    constructor() {
        this.commands = {
            'ping': this.handlepingpong,
            'id': this.handleID,
            'users': this.handleUsersOnline,
            'kick': this.handleKick
        }

    }

    async handlepingpong(command, client, game) {
        bot.sendmsg('Pong', client)
    }

    async handleID(command, client, game) {
        bot.sendmsg(`Your ID is ${client.ID}`, client)
    }

    async handleUsersOnline(command, client, game) {
        bot.sendmsg(`There are ${game.getusers()} users online`, client)
    }

    async handleKick(command, client, game) {
        if (!client.get('moderator')) return

        let arg = command[0],
            player = isNaN(arg) ? game.getusername(arg) : game.getuser(arg);

        if (player) {
            player.writeError(5)
            game.removeClient(player)
        }

    }

};

module.exports = Commands;