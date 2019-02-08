var cluster = require('cluster'),
    threads = 10,
    log = require('js-logs'),
    config = require('./config.json'),
    figlet = require('figlet');

let plugins = []

if (cluster.isMaster) {

    for (var i = 0; i < threads; i++) {

        cluster.fork().send({
            doLog: i === 0
        })
    }

    cluster.on('exit', function() {
        cluster.fork();
    })

} else {
    process.on('message', function(msg) {
        if (msg.doLog) {
            figlet.text('BingoJS', {}, function(err, data) {
                console.log(`${data} \r\n`);
                console.log(log.success(`Source started with ${threads} threads and Game port: ${config.Ports.Game} \r\n`));

                for (i in config.plugins) {
                    if (config.plugins[i].enabled) {
                        plugins.push(config.plugins[i].name)
                    }
                }

                console.log(`Loaded plugins: ${plugins.join(', ')} \r\n`)

            });


        }
    });

    new(require('./game.js'))().handleGame()
}