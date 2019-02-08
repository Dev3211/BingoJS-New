var Crypto = require('./Crypto.js'),
    error = require('./Errors.js'),
    xml = require('elementtree'),
    config = require("../config"),
    db = require('mysql2/promise');


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

class Login {

    constructor() {

        this.xmlHandlers = {
            'verChk': 'handleVerChk',
            'rndK': 'handleRndK',
            'login': 'handleLogin'
        }

    }

    async policy(client) {
        await client.write('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>');
    }

    async handleXml(data, client) {
        if (data == '<policy-file-request/>') {
            return this.policy(client)
        }

        let result = xml.parse(data)

        var type = result['_root']['_children'][0],
            action = type['attrib']['action'].toString();

        var method = this.xmlHandlers[action];

        if (typeof this[method] == 'function') {
            this[method](data, client, type);
        }
    }

    async handleVerChk(data, client, xml) {
        client.write('<msg t="sys"><body action="apiOK" r="0"></body></msg>');
    }

    async handleBuddyOnline(ID) {
        let [result] = await connection.query("SELECT PlayerID, username FROM `buddies` WHERE `ID` = ?", [parseInt(ID)])

        for (let i in result) {
            let [result1] = await connection.query("SELECT online FROM `users` WHERE `ID` = ?", [result[i].PlayerID])
            if (result1.length != 0) {
                if (result1[0].online == '1') {
                    return true;
                    break;
                }
            }
            return false
        }
    }

    async handleClientOnline(ID) {
        if (!parseInt(ID)) return
        let [result] = await connection.query("SELECT online FROM `users` WHERE `ID` = ?", [ID])
        if (result.length != 0) {
            if (result[0].online == '1') {
                return true;
            }
        }
        return false
    }

    async handleRndK(data, client, xml) {
        await client.set('randomKey', Crypto.generateKey());
        await client.write('<msg t="sys"><body action="rndK" r="-1"><k>' + await client.get('randomKey') + '</k></body></msg>');
    }

    async handleLogin(data, client, xml) {
        var username = xml['_children'][0]['_children'][0]['text'],
            pass = xml['_children'][0]['_children'][1]['text'],
			key = client.get('randomKey')

        var [result] = await connection.query("SELECT * FROM `users` WHERE `user` = ?", [username])
        if (result.length === 0) {
            client.write('%xt%e%-1%' + USERNAME_NOT_FOUND + '%');
        } else {
            let hash = result[0].password.toUpperCase(),
                user = result[0].user,
                ID = result[0].ID;

            let encrypt = Crypto.encryptPassword(hash, await client.get('randomKey'));

            if (user === null) {
                client.write('%xt%e%-1%' + INCORRECT_PASSWORD + '%');
            }

            if (client.socket.localPort == 6112) {
                if (encrypt === pass) {
                    let serverList = await this.getServerList(),
                        budonline = await this.handleBuddyOnline(result[0].ID),
                        clientonline = await this.handleClientOnline(result[0].ID),
                        banned = result[0].banned,
                        currentdate = new Date(),
                        bannedate = new Date(banned * 1000);

                    if (banned != 0) {
                        if (bannedate > currentdate) {
							let difference = Math.abs(bannedate.getTime() - currentdate.getTime()),
                                hours = Math.round(difference / 60000 / 60);
								
                            client.write('%xt%e%-1%' + BAN_DURATION + '%' + hours + '%'),
                            client.socket.end(),
                            client.socket.destroy();
                            return
                        }
                    }else if (clientonline) {
                        client.write('%xt%e%-1%' + MULTIPLE_CONNECTIONS + '%'),
                        client.socket.end(),
                        client.socket.destroy();
                        return;
                    }

                    if (budonline) {
                        client.sendXt('l', -1, ID, key, '100', serverList);
                    } else {
                        client.sendXt('l', -1, ID, key, '', serverList);
                    }

                    await connection.query("UPDATE `users` set `loginkey` = ? WHERE `user` = ?", [key, username])
                    client.socket.destroy();
                } else {
                    client.write('%xt%e%-1%' + INCORRECT_PASSWORD + '%');
                }
            } else {
                if (result.length != 0) {
                    let hash = pass.substr(32),
                        ID = result[0].ID,
                        key = result[0].loginkey,
                        userarray = result[0];
                  		
                    if (hash == key) {
                        await connection.query("UPDATE `users` set `loginkey` = ? WHERE `user` = ?; UPDATE `server` set `population` = population + ?", ['', username, 1])
                        client.sendXt('l');
                        client.setClient(userarray);
                        await connection.query("UPDATE `users` set `online` = ? WHERE `ID` = ?", [1, await client.ID])
                    } else {
                        client.write('%xt%e%-1%' + INCORRECT_PASSWORD + '%');
                    }
                }
            }
        }
    }

    async getServerList() {
        let serverArr = [];
        let [result] = await connection.query("SELECT * FROM `server`")

        if (result[0].population != 0) {
			var calculate = Math.floor((6 * result[0].population) / config.Servers.maxUsers)
        } else {
            calculate = 0
        }
        serverArr.push(`100,${calculate}`);
        return serverArr.join('%');
    }

};

module.exports = Login;
