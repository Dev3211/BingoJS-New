var logger = require('js-logs'),
    log = require('js-logs'),
    config = require("./config"),
    net = require('net'),
    Login1 = config.Ports.Login;

class RunLogin {
    constructor() {}

    handleLogin() {
        var server = net.createServer(function(socket) {
            socket.setTimeout(600000),
                socket.setEncoding('utf8'),
                socket.setNoDelay(true);

            var client = require('./handlers/client'),
                clientObj = new client(socket);

            socket.on('data', function(data) {
                data = data.toString().split('\0')[0];
                console.log(`[INCOMING] -> [${data}] \n`)

                let dataType = data.charAt(0);

                if (dataType == '<') {
                    new(require('./handlers/handleLogin'))().handleXml(data, clientObj);
                }else if (dataType == '%') {
                    new(require('./handlers/handleGame'))().handleraw(data, client);
                }
            });
        });

        server.listen(Login1, function() {});

    }

};

module.exports = RunLogin;
