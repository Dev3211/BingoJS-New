var client = require('./client'),
    Crypto = require('./Crypto.js'),
    jf = require('jsonfile'),
    error = require('./Errors.js'),
    loginkey = Crypto.generateKey(),
    config = require("../config"),
    db = require('mysql2/promise'),
    itemCrumbs = jf.readFileSync('./handlers/crumbs/items.json'),
    furnitureCrumbs = jf.readFileSync('./handlers/crumbs/furniture.json'),
    iglooFloors = jf.readFileSync('./handlers/crumbs/igloofloor.json'),
    iglooCrumbs = jf.readFileSync('./handlers/crumbs/igloo.json'),
    roomManagerr = new(require('./roomManager.js'))();

(async function() {
    global.connection = await db.createPool({
        connectionLimit: 5,
        queueLimit: 0,
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    });
})()

var plugins = []


for (i in config.plugins) {
    if (config.plugins[i].enabled) {
        plugins[config.plugins[i].name] = new(require(config.plugins[i].directory))
    }
}

class Game {

    constructor() {
        this.clients = [],
            this.openigloos = [],
            this.xtHandlers = {
                's': {
                    'j#js': 'handleJoinServer',
                    'u#h': 'handleHeartBeat',
                    'i#gi': 'handleGetInventory',
                    'u#gp': 'handleGetPlayer',
                    'm#sm': 'handleSendMessage',
                    'j#jr': 'handleJoinRoom',
                    'j#jp': 'handleJoinPlayerRoom',
                    'u#sp': 'handleSendPosition',
                    'u#sb': 'handleSnowball',
                    'u#se': 'handleEmote',
                    'u#ss': 'handleSendSafe',
                    'u#sf': 'handlesendFrame',
                    'u#sa': 'handleAction',
                    'u#sg': 'handleTour',
                    'u#sj': 'handleJoke',
                    'f#epfgf': 'Testt',
                    'f#epfgr': 'Testt',
                    'p#pg': 'Test',
                    'u#ss': 'handleSafeMessage',
                    'g#gm': 'handleGetActiveIgloo',
                    'g#gr': 'handleLoadPlayerIglooList',
                    'g#go': 'handlegetIgloos',
                    'g#af': 'handleIglooFurniture',
                    'g#gf': 'handlegetFurniture',
                    'g#ur': 'handleSaveFurniture',
                    'g#um': 'handleUpdateMusic',
                    'g#or': 'handleOpenIgloo',
                    'g#cr': 'handleCloseIgloo',
                    'g#au': 'handleBuyIgloo',
                    'g#ao': 'handleUpdateIgloo',
                    'o#m': 'handleMute',
                    'o#k': 'handleKick',
                    'o#b': 'handleBan',
                    'b#br': 'handleBuddyRequest',
                    'b#ba': 'handleBuddyAdd',
                    'b#rb': 'handleRemoveBuddy',
                    'b#bf': 'handleBuddyFind',
                    'b#gb': 'handleGetBuddies',
                    'n#gn': 'handleGetIgnores',
                    'n#an': 'handleAddIgnore',
                    'n#rn': 'handleRemoveIgnore',
                    'g#ag': 'handleUpdateIglooFloor',
                    's#upc': 'handleUpdateClothing',
                    's#uph': 'handleUpdateClothing',
                    's#upf': 'handleUpdateClothing',
                    's#upn': 'handleUpdateClothing',
                    's#upb': 'handleUpdateClothing',
                    's#upa': 'handleUpdateClothing',
                    's#upe': 'handleUpdateClothing',
                    's#upl': 'handleUpdateClothing',
                    's#upp': 'handleUpdateClothing',
                    'i#ai': 'handleAddItem'
                },
                'z': {
                    'zo': 'handleGameOver'
                }
            };

    }

    addClient(client) {
        if (client) {
            this.clients.push(client);
        }
    }

    clientOnline(id) {
        for (i in this.clients) {
            if (this.clients[i].ID === id) {
                return true;
            }
        }

        return false;
    }


    getuser(id) {
        for (var i in this.clients) {
            if (this.clients[i].get('ID') == id) {
                return this.clients[i];
            }
        }
        return false;
    }
	
	getusername(name) {
        for (var i in this.clients) {
            if (this.clients[i].get('user').toLowerCase() == name.toLowerCase()) {
                return this.clients[i];
            }
        }
        return false;
    }

    getusers() {
        return this.clients.length
    }

    async removeClient(socket) {
        for (var i in this.clients) {
            var client = this.clients[i];
            if (socket == client.socket) {
                this.clients.splice(i, 1);
                await connection.query("UPDATE `users` set `online` = ? WHERE `ID` = ?", [0, client.ID])
                roomManagerr.removeUser(client);
                socket.destroy();
            }
        }
    }

    handleHeartBeat(data, client) {
        client.sendXt('h', -1);
    }

    async handleBuddyRequest(data, client) {
        var ID = parseInt(data[4]);

        if (ID === client.get('ID')) return

        let length = await client.BuddyLength()
        if (length >= 100) return client.writeError(901)

        let otherclient = this.getuser(ID);

        if (otherclient) {
            let length = await otherclient.BuddyLength()
            if (length >= 100) return otherclient.writeError(901)
            let check = otherclient.get('requests')
            if (check.includes(client.get('ID'))) return
            check.push(client.get('ID'))
            otherclient.sendXt('br', -1, client.get('ID'), client.get('user'))
        }

    }

    async handleBuddyAdd(data, client) {
        let ID = parseInt(data[4])

        let length = await client.BuddyLength()
        if (length >= 100) return client.writeError(901)

        let check = client.get('requests')

        if (!check.includes(ID)) return

        let otherclient = this.getuser(ID);

        if (otherclient) {
            let exists = await otherclient.BuddyExists(client.get('ID'))

            if (exists) return


            await client.addBuddie(client, otherclient.ID, otherclient.user)
            await otherclient.addBuddie(otherclient, client.ID, client.user)

            otherclient.sendXt('ba', -1, client.ID, client.user)
        }
        client.sendXt('ba', -1, ID, otherclient.user)
        let getindex = client.requests.indexOf(ID)
        client.requests.splice(getindex, 1)
    }

    handleBuddyFind(data, client) {
        let ID = parseInt(data[4])

        let otherclient = this.getuser(ID)

        if (otherclient) client.sendXt('bf', -1, otherclient.get('room'))
    }

    async handleRemoveBuddy(data, client) {
        let ID = parseInt(data[4])

        let otherclient = this.getuser(ID);

        if (otherclient) {
            await otherclient.removeBuddie(client.get('ID'))
            await client.removeBuddie(ID)
            otherclient.sendXt('rb', -1, client.ID, client.user)

        }

        client.sendXt('rb', -1, otherclient.ID, otherclient.user)
    }

    async handleGetBuddies(data, client) {
        let buds = await client.getBuddies(client.ID, this)
        client.sendXt('gb', -1, buds)
    }

    async handleGetIgnores(data, client) {
        let ignores = await client.getIgnores(client.ID, this)
        client.sendXt('gn', -1, ignores)
    }

    async handleAddIgnore(data, client) {
        let ID = parseInt(data[4])
        let exists = await client.BuddyExists(ID)
        let ignorexists = await client.IgnoreExists(ID)

        if (exists) return
        if (ignorexists) return

        let otherclient = this.getuser(ID);

        if (otherclient) {
            await client.addIgnore(client, otherclient.ID, otherclient.user)
            client.sendXt('gn', -1, ID)
        }

    }

    async handleRemoveIgnore(data, client) {
        let ID = parseInt(data[4])
        let otherclient = this.getuser(ID);

        if (otherclient) {
            await client.removeIgnore(ID)
            client.sendXt('rn', -1, ID)
        }

    }


    async handleGetPlayer(data, client) {
        var ID = data[4];

        let [result] = await connection.query("SELECT * FROM `users` WHERE `ID` = ?", [ID])

        if (result.length != 0) {
            const info = [result[0].ID, result[0].user, 1, result[0].color, result[0].head, result[0].face, result[0].neck, result[0].body, result[0].hand, result[0].feet, result[0].flag, result[0].photo];
            client.sendXt('gp', -1, info.join('|') + '|')
        }
    }

    async handleraw(data, client) {
        var dataArr = data.split('%');
        dataArr.shift();

        var type = dataArr[1];
        var handler = dataArr[2];


        var method = this.xtHandlers[type][handler];

        if (typeof this[method] == 'function') {
            this[method](dataArr, client);
        } else {
            console.log('Unhandled packet received: ' + handler);
        }
    }


    async handleJoinServer(data, client) {
        var timeStamp = Math.floor(new Date() / 1000);
        client.sendXt('js', -1, 0, 1, client.get('moderator') ? 1 : 0);
        client.sendXt('gps', -1, '');
        client.sendXt('lp', -1, client.buildPlayerString(), client.get('coins'), 0, 1440, Math.floor(new Date() / 1000), client.get('age'), 1000, 187, "", 7)

        this.handleJoinRoom({
            4: 100
        }, client);
    }

    async handleMute(data, client) {
        let player = parseInt(data[4]);

        if (client.get('moderator')) {
            let getplayer = this.getuser(player)

            if (getplayer) {
                getplayer.mute()
            }
        }
    }

    async handleKick(data, client) {
        let player = parseInt(data[4]);

        if (client.get('moderator')) {
            let getplayer = this.getuser(player)
            if (getplayer.get('rank') >= client.get('rank')) return
            if (getplayer) {
                getplayer.writeError(KICK)
                this.removeClient(getplayer)
            }
        }
    }

    async handleBan(data, client) {
        if (!client.get('moderator')) return

        let player = parseInt(data[4]);

        let timestamp = new Date()
        timestamp.setDate(timestamp.getDate() + 1)
        timestamp = Math.round(timestamp.getTime() / 1000);

        let getplayer = this.getuser(player)
        if (getplayer.get('rank') >= client.get('rank')) return

        if (getplayer) {
            await getplayer.addBan(timestamp)
            getplayer.sendXt('e', -1, 610, data[5])
            this.removeClient(getplayer)
        }

    }


    async handleJoinRoom(data, client) {
        var room = data[4];

        var x = data[5] ? data[5] : 0;
        var y = data[6] ? data[6] : 0;

        if (client.get('room')) roomManagerr.removeUser(client);

        if (room > 900) {
            client.set('gamingroom', room);
            return client.sendXt('jg', -1, room)
        }

        if (roomManagerr.roomExists(room)) {
            roomManagerr.addUser(room, client, [x, y]);
        } else {
            roomManagerr.addUser(100, client, [0, 0]);
        }

        if (plugins['bot']) {
            client.sendXt('rp', -1, plugins['bot'].ID);
            client.sendXt('ap', -1, plugins['bot'].generateBot());
        }


    }

    async handleJoinPlayerRoom(data, client) {
        var room = parseInt(data[4]);
        let x = parseInt(data[5])
        let y = parseInt(data[6])


        if (!x || isNaN(x)) x = 0
        if (!y || isNaN(y)) y = 0

        if (client.get('room')) {
            roomManagerr.removeUser(client);
        }

        if (room < 1000) room += 1000

        if (!roomManagerr.getRoom(room)) {
            roomManagerr.createRoom(room)
        }

        var test = roomManagerr.getRoom(room)

        if (test) {
            roomManagerr.addUser(room, client, [x, y]);
        } else {
            console.log('nope');
        }
    }

    async handleGetInventory(data, client) {
        let inventory = await client.getInventory()
        client.sendXt('gi', -1, inventory);
    }

    async handleSendMessage(data, client) {
        var message = data[5];

        if (message.startsWith('!') && plugins['commands']) {
            var commandArr = message.substr(1).split(' ');

            let obj = {
                name: commandArr.shift(),
                args: commandArr
            }

            if (plugins['commands'].commands[obj.name]) {
                plugins['commands'].commands[obj.name](obj.args, client, this);
            }

        }

        if (!client.muted) roomManagerr.sendXt(client.get('room'), ['sm', -1, client.get('ID'), message]);
    }

    async handleSendPosition(data, client) {
        var x = parseInt(data[4]),
            y = parseInt(data[5]);
        client.set('x', x);
        client.set('y', y);

        roomManagerr.sendXt(client.get('room'), ['sp', -1, client.get('ID'), x, y]);
    }

    async handleSnowball(data, client) {
        var x = parseInt(data[4]),
            y = parseInt(data[5]);
        roomManagerr.sendXt(client.get('room'), ['sb', -1, client.get('ID'), x, y]);
    }

    async handleEmote(data, client) {
        var emote = data[4];
        roomManagerr.sendXt(client.get('room'), ['se', -1, client.get('ID'), emote]);
    }

    async handlesendFrame(data, client) {
        var frame = parseInt(data[4]);
        roomManagerr.sendXt(client.get('room'), ['sf', -1, client.get('ID'), frame]);
    }

    async handleSendSafe(data, client) {
        var ID = parseInt(data[4]);
        roomManagerr.sendXt(client.get('room'), ['ss', -1, client.get('ID'), ID]);
    }

    async handleUpdateClothing(data, client) {
        var item = parseInt(data[4]),
            type = data[2].substr(2);

        var itemTypes = {
            'upc': 'color',
            'uph': 'head',
            'upf': 'face',
            'upn': 'neck',
            'upb': 'body',
            'upa': 'hand',
            'upe': 'feet',
            'upl': 'flag',
            'upp': 'photo'
        };

        if (itemTypes[type]) {
            roomManagerr.sendXt(client.get('room'), [type, -1, client.get('ID'), item]);
            client.updateClothing(itemTypes[type], item);
        }
    }

    async handleAddItem(data, client) {
        var item = parseInt(data[4]);
        if (itemCrumbs.find(o => o.paper_item_id == item)) {
            console.log('Adding item: ' + item);
            var cost = itemCrumbs.find(o => o.paper_item_id == item).cost
            if (client.get('coins') < cost) {
                client.write('%xt%e%-1%' + NOT_ENOUGH_COINS + '%');
                return;
            }
            client.delCoins(cost);
            client.addItem(item);
        } else {
            client.write('%xt%e%-1%' + ITEM_DOES_NOT_EXIST + '%');
        }
    }

    async handleIglooFurniture(data, client) {
        const furniture = parseInt(data[4])
        if (furnitureCrumbs[furniture]) {
            const itemCost = furnitureCrumbs[furniture].cost
            if (client.get('coins') < itemCost) return client.write('%xt%e%-1%' + NOT_ENOUGH_COINS + '%');
            client.delCoins(itemCost);
            return client.addFurniture(furniture)
        } else {
            client.write('%xt%e%-1%' + ITEM_DOES_NOT_EXIST + '%');
        }
    }

    async handlegetFurniture(data, client) {
        await client.getFurniture();
    }

    async handleAction(data, client) {
        var action = data[4];
        roomManagerr.sendXt(client.get('room'), ['sa', -1, client.get('ID'), action]);
    }

    async handleTour(data, client) {
        var tour = data[4];
        roomManagerr.sendXt(client.get('room'), ['sg', -1, client.get('ID'), tour]);
    }

    async handleJoke(data, client) {
        var joke = data[4];
        roomManagerr.sendXt(client.get('room'), ['sj', -1, client.get('ID'), joke]);
    }

    async handleGetActiveIgloo(data, client) {
        var ID = parseInt(data[4]);

        let [result] = await connection.query("SELECT ID FROM `users` WHERE `ID` = ?", [ID])
        if (result.length != 0) {
            let [result1] = await connection.query("SELECT * FROM `igloo` WHERE `OwnerID` = ?", [ID])
            if (result1.length != 0) {
                client.sendXt('gm', -1, client.get('ID'), result1[0].Type, result1[0].Music, result1[0].Floor, result1[0].Furniture, result1[0].Locked);
            } else {
                let query = await connection.query("INSERT INTO igloo (OwnerID) VALUES (?)", [ID]);
                if (query) client.sendXt('gm', -1, client.get('ID'), result1[0].Type, result1[0].Music, result1[0].Floor, result1[0].Furniture, result1[0].Locked);
            }
        }
    }


    Test(data, client) {
        client.sendXt('pg', -1, 750);
    }

    Testt(data, client) {}

    async handleGameOver(data, client) {
        let score = parseInt(data[4]);

        let nodivide = [916, 906, 905, 904, 912];
        let gameroom = client.get('gamingroom');

        if (gameroom > 1000) {
            return;
        } else if (score == 0) {
            return client.sendXt('zo', -1, client.coins, '', 0, 0, 0);
        }

        if (!isNaN(score)) {
            if (nodivide.includes(gameroom)) {
                let add = await client.addCoins(score)
                if(add) client.sendXt('zo', -1, client.coins, 0, 0, 0, 0);
            } else if (score > 0 && score < 9999) {
                let round = Math.floor(score / 10)
                let add = await client.addCoins(round)
                if (add) client.sendXt('zo', -1, client.coins, 0, 0, 0, 0);
            }

        }
    }

    async handleLoadPlayerIglooList(data, client) {
        if (this.openigloos.length == 0) {
            return client.sendXt('gr', -1);
        }

        if (Object.keys(this.openigloos).length == 0) {
            return client.sendXt('gr', -1);
        }

        var iglooList = [];

        for (var index in Object.keys(this.openigloos)) {
            var playerId = Object.keys(this.openigloos)[index];
            var playerNickname = this.openigloos[playerId];
            var iglooDetails = [playerId, playerNickname].join('|');
            iglooList.push(iglooDetails);
        }
        client.sendXt('gr', -1, iglooList.join('%'));

    }

    async handlegetIgloos(data, client) {
        client.sendXt('go', -1, client.getIgloos());
    }

    async handleSaveFurniture(data, client) {
        let furniture = data;

        let test1 = furniture.join(',').substr(13);

        if (furniture.length < 1) {
            await connection.query("UPDATE `furnitures` set `FurnitureID` = ? WHERE `PlayerID` = ?", ["[]", this.ID])
        }else if (furniture.length > 99) {
            client.write('%xt%e%-1%' + MAX_IGLOO_FURNITURE + '%');
        }

        await connection.query("UPDATE `igloo` set `Furniture` = ? WHERE `OwnerID` = ?", [test1, client.get('ID')]);
    }

    async handleUpdateMusic(data, client) {
        var musicid = parseInt(data[4]);
        if (isNaN(musicid)) {
            return;
        }
        await connection.query("UPDATE `igloo` set `Music` = ? WHERE `OwnerID` = ?", [musicid, client.get('ID')])
    }

    async handleOpenIgloo(data, client) {
        let playerid = data[4];


        if (Number(playerid) !== client.get('ID')) {
            return;
        }

        this.openigloos[client.get('ID')] = client.get('user');
    }

    async handleCloseIgloo(data, client) {
        playerid = data[4];
        if (Number(playerid) !== client.get('ID')) {
            return;
        }
        delete this.openigloos[client.get('ID')];
    }

    async handleBuyIgloo(data, client) {
        var type = parseInt(data[4])
        if (iglooCrumbs[type]) {
            var cost = iglooCrumbs[type].cost
            if (client.get('coins') < cost) return client.write('%xt%e%-1%' + NOT_ENOUGH_COINS + '%');
            await client.delCoins(cost);
            if (!isNaN(type)) return client.addIgloo(type)
        } else {
            client.write('%xt%e%-1%' + ITEM_DOES_NOT_EXIST + '%');
        }
    }

    async handleUpdateIgloo(data, client) {
        const igloo = parseInt(data[4])
        if (!isNaN(igloo)) return client.updateIgloo(igloo);
    }

    async handleUpdateIglooFloor(data, client) {
        const floor = parseInt(data[4])
        if (iglooFloors[floor]) {
            var cost = iglooFloors[floor].cost
            if (client.get('coins') < cost) return client.write('%xt%e%-1%' + NOT_ENOUGH_COINS + '%');
            await client.delCoins(cost);
            if (!isNaN(floor)) return client.addFloor(floor)
        } else {
            client.write('%xt%e%-1%' + ITEM_DOES_NOT_EXIST + '%');
        }
    }

}
module.exports = Game;
