var client = require('./handlers/client'),
    net = require('net'),
    Crypto = require('./handlers/Crypto.js'),
    db = require('mysql2/promise'),
    config = require("./config"),
    log = require('js-logs'),
    game = new(require('./handlers/handleGame'))();

(async function() {
    global.connection = await db.createPool({
        connectionLimit: 5,
        queueLimit: 0,
        multipleStatements: true,
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    });
})()


class RunGame {

    constructor() {
	global.self = this,
	self.Game1 = config.Ports.Game;
	}

    handledata(data, client) {
        data = data.toString().split('\0')[0];
        console.log(`[INCOMING] -> [${data}] \n`)

        let dataType = data.charAt(0);

        if (dataType == '%') {
            game.handleraw(data, client);
        } else if (dataType == '<') {
            new(require('./handlers/handleLogin'))().handleXml(data, client);
        }
    }

    handleGame() {
        var server = net.createServer(function(socket) {
            socket.setTimeout(600000);
            socket.setEncoding('utf8');
            socket.setNoDelay(true);


            var clientObj = new client(socket, connection);
            game.addClient(clientObj);

            socket.on('data', function(data) {
                self.handledata(data, clientObj)
            });
            socket.on('close', async function() {
                await connection.execute("UPDATE `server` set `population` = population - ?", [1])
                game.removeClient(socket);
            });
            socket.on('error', function(err) {
                if (err.code !== 'ECONNRESET') {
                    console.log(err.toString());
                }
            });
        });

        server.listen(self.Game1, function() {});

    }
};

module.exports = RunGame;