var jf = require('jsonfile'),
    furnitureCrumbs = jf.readFileSync('./handlers/crumbs/furniture.json'),
    itemCrumbs = jf.readFileSync('./handlers/crumbs/items.json'),
    floorCrumbs = jf.readFileSync('./handlers/crumbs/igloofloor.json'),
    config = require("../config");

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

var client = function(socket, connection) {
    var self = this;

    this.socket = socket;
    this.data = [];
    this.randomKey = "";
    this.x = 0;
    this.y = 0;
    this.frame = 1;

    client.prototype.get = function(get) {
        return this[get];
    };

    client.prototype.set = function(set, value) {
        return this[set] = value;
    };

    client.prototype.write = function(data) {
        if (this.socket) {
            console.log(`[OUTGOING] -> [${data}] \n`)
            this.socket.write(data + '\0');
        }
    };

    client.prototype.writeError = function(error) {
        this.write('%xt%e%-1%' + error + '%');
    };

    client.prototype.sendXt = function() {
        var args = Array.prototype.join.call(arguments, '%');
        this.write('%xt%' + args + '%');
    };

    client.prototype.getTime = function() {
        return (Math.floor(new Date() / 1000))
    }

    client.prototype.setClient = function(data) {
        let time = (self.getTime() - data.registrationdate);
        self.ID = data.ID;
        self.user = data.user;
        self.coins = data.coins;
        self.rank = data.rank;
        self.muted = data.muted == 1 ? true : false;
        self.age = Math.round(time / 86400)
        self.moderator = data.moderator == 1 ? true : false;
        self.igloos = data.igloos ? JSON.parse(JSON.stringify(data.igloos)) : [];
        self.color = data.color;
        self.head = data.head;
        self.face = data.face;
        self.neck = data.neck;
        self.body = data.body;
        self.hand = data.hand;
        self.feet = data.feet;
        self.flag = data.flag;
        self.photo = data.photo;
        self.requests = [];
    }

    client.prototype.buildPlayerString = function() {
        var playerArr = [
            this.ID,
            this.user,
            45,
            this.color,
            this.head,
            this.face,
            this.neck,
            this.body,
            this.hand,
            this.feet,
            this.flag,
            this.photo,
            this.x,
            this.y,
            this.frame,
            1,
            this.rank * 146
        ];
        return playerArr.join('|');
    };

    client.prototype.updateClothing = async function(type, item) {
        self.set(type, item)
        await connection.execute('UPDATE `users` SET ' + type + ' = ? WHERE `user` = ?', [item, self.user])
    }


    client.prototype.getInventory = async function() {
            let [result] = await connection.execute('SELECT itemID FROM `items` WHERE `PlayerID` = ?', [self.ID])
            let data = []

            if (result.length != 0) {
                result.forEach(function(row) {
                    const info = [row.itemID];
                    data.push(info);
                });
                return data.join('%');
            }
        }

        client.prototype.BuddyExists = async function(id) {
            let ID = parseInt(id);
            if (ID) {
                let [result] = await connection.execute("SELECT PlayerID, username FROM `buddies` WHERE `ID` = ?", [self.ID])
                if (result.length != 0) {
                    await asyncForEach(result, async(row) => {
                        if (row.PlayerID == ID) {
                            return true;
                        }
                    })
                }
            }
        }

        client.prototype.IgnoreExists = async function(id) {
            let ID = parseInt(id)

            if (ID) {
                let [result] = await connection.execute("SELECT PlayerID, username FROM `ignored` WHERE `ID` = ?", [self.ID])

                if (result.length != 0) {
                    await asyncForEach(result, async(row) => {
                        if (row.PlayerID == ID) {
                            return true;
                        }
                    })
                }
            }
        }

        client.prototype.BuddyLength = async function() {
            let [result] = await connection.execute("SELECT PlayerID, username FROM `buddies` WHERE `ID` = ?", [self.ID])
            return result.length
        }


        client.prototype.getBuddies = async function(ID, lol) {
            let buddies = []

            let [result] = await connection.execute("SELECT PlayerID, username FROM `buddies` WHERE `ID` = ?", [ID])
            let online = 0;

            if (result.length != 0) {
                await asyncForEach(result, async(row) => {
                    if (lol.clientOnline(row.PlayerID)) {
                        online = 1;
                        let details = [row.PlayerID, row.username, online]
                        buddies.push(details.join('|'));
                        let client = lol.getuser(row.PlayerID)
                        client.sendXt('bon', -1, self.ID)
                    } else {
                        online = 0
                        let details = [row.PlayerID, row.username, online]
                        buddies.push(details.join('|'));
                    }
                })
                return buddies.join('%')
            } else {
                return buddies.join('0%')
            }

        }

    client.prototype.getIgnores = async function(ID, lol) {
        let ignored = []

        let [result] = await connection.execute("SELECT PlayerID, username FROM `ignored` WHERE `ID` = ?", [ID])

        if (result.length != 0) {
            await asyncForEach(result, async(row) => {
                let details = [row.PlayerID, row.username]

                ignored.push(details.join('|'))
            })
            return ignored.join('%')
        } else {
            return ignored.join('%')
        }
    }

    client.prototype.addItem = async function(item) {
        if (itemCrumbs.find(o => o.paper_item_id == item)) {
            let result = await connection.execute("INSERT INTO items (username, PlayerID, itemID, used) VALUES (?, ?, ?, ?)", [self.user, self.ID, item, 1])
            self.sendXt('ai', -1, item, self.get('coins'));
        } else {
            console.log('Item does not exist in the crumbs');
        }
    }

    client.prototype.addBuddie = async function(client, ID, username) {
        if (parseInt(ID) && username) {
            await connection.execute("INSERT INTO buddies (ID, PlayerID, username) VALUES (?, ?, ?)", [client.ID, ID, username])
        }
    }

    client.prototype.removeBuddie = async function(ID) {
        if (parseInt(ID)) {
            await connection.execute("DELETE FROM buddies WHERE PlayerID = ?", [ID])
        }
    }
	
    client.prototype.addIgnore = async function(client, ID, username) {
	   if (parseInt(ID) && username) {
            await connection.execute("INSERT INTO ignored (ID, PlayerID, username) VALUES (?, ?, ?)", [client.ID, ID, username])
        }
    }
	
    client.prototype.removeIgnore = async function(ID) {
	   if (parseInt(ID)) {
            await connection.execute("DELETE FROM ignored WHERE PlayerID = ?", [ID])
        }
    }
	
    client.prototype.getFurniture = async function() {
        let [result] = await connection.execute("SELECT FurnitureID, Quantity FROM `furnitures` WHERE `PlayerID` = ?", [self.ID])

        if (result.length != 0) {
            result.forEach(function(row) {
                const info = [row.FurnitureID, row.Quantity];
                self.sendXt('gf', -1, info.join('|') + '|')
            });
        } else {
            const info = [];
            self.sendXt('gf', -1, info)
        }
    }


    client.prototype.delCoins = async function(coins) {
        let newcoins = parseInt(self.coins) - parseInt(coins)

        await connection.execute('UPDATE `users` SET coins =  ? WHERE `user` = ?', [newcoins, self.user])

        self.set('coins', newcoins)

        return newcoins
    }

    client.prototype.addCoins = async function(coins) {
        let newcoins = parseInt(self.coins) + parseInt(coins)

        await connection.execute('UPDATE `users` SET coins = ? WHERE `user` = ?', [newcoins, self.user])

        self.set('coins', newcoins)

        return newcoins;
    }

    client.prototype.getIgloos = function() {
        if (self.igloos.length > 0) {
            var test = self.igloos.split("|");
            return test.join("|");
        }
    }

    client.prototype.addFurniture = async function(furniturez) {
        if (furnitureCrumbs[furniturez]) {
            let [result] = await connection.execute("SELECT FurnitureID FROM `furnitures` WHERE `FurnitureID` = ? AND `PlayerID` = ?", [furniturez, self.ID])
            if (result.length != 0) {
                let update = await connection.execute('UPDATE `furnitures` SET `Quantity` = Quantity + ? WHERE `PlayerID` = ?', [1, self.ID])

                self.sendXt('af', -1, furniturez, self.get('coins'));
            } else {
                let update = await connection.execute("INSERT INTO furnitures (PlayerID,  FurnitureID, Quantity, username) VALUES (?, ?, ?, ?)", [self.ID, furniturez, 1, self.user])
                self.sendXt('af', -1, furniturez, self.get('coins'));
            }
        } else {
            console.log('Item does not exist in the crumbs');
        }
    }

    client.prototype.addIgloo = async function(igloo) {
        if (!isNaN(igloo)) {
            if (!self.igloos[igloo]) {
                let update = await connection.execute('UPDATE `users` SET `igloos` =' + `concat(igloos, "|", ${igloo})` + 'WHERE `ID` = ?', [self.ID])

                if (self.get('room') === (self.ID + 1000)) {
                    self.sendXt('au', -1, igloo, self.coins)
                }
            }
        }
    }

    client.prototype.mute = async function() {
        if (self.muted) {
            self.set('muted', 0)

            await connection.execute('UPDATE `users` SET `muted` = ? WHERE `ID` = ?', [0, self.ID])
        } else {
            self.set('muted', 1)

            await connection.execute('UPDATE `users` SET `muted` = ? WHERE `ID` = ?', [1, self.ID])
        }
    }
	
	client.prototype.addBan = async function(timestamp) {
    if (parseInt(timestamp)) {
        await connection.execute('UPDATE `users` SET `banned` = ? WHERE `ID` = ?', [timestamp, self.get('ID')])
    }
   }


    client.prototype.addFloor = async function(floor) {
        if (floorCrumbs[floor] && !isNaN(floor)) {

            let [update] = await connection.execute('UPDATE `igloo` SET `Floor` = ? WHERE `OwnerID` = ?', [floor, self.ID])

            if (update) {
                self.sendXt('ag', -1, floor, self.coins)
            }
        }
    }

    client.prototype.updateIgloo = async function(igloo) {
        if (!isNaN(igloo)) {
            await connection.execute('UPDATE `igloo` SET `Furniture` = ?, `Floor` = ?, `Type` = ? WHERE `OwnerID` = ?', ["[]", 0, igloo, self.ID])
        }
    }

    client.prototype.addItem = async function(item) {
        if (itemCrumbs.find(o => o.paper_item_id == item)) {
            await connection.execute("INSERT INTO items (username, PlayerID, itemID, used) VALUES (?, ?, ?, ?)", [self.user, self.ID, item, 1])

            self.sendXt('ai', -1, item, self.get('coins'));
        } else {
            console.log('Item does not exist in the crumbs');
        }
    }

};

module.exports = client;