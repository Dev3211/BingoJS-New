var jf = require('jsonfile'),
    rooms = jf.readFileSync("./handlers/crumbs/rooms.json"),
    items = jf.readFileSync("./handlers/crumbs/items.json"),
    furniture = jf.readFileSync("./handlers/crumbs/furniture.json"),
    igloo = jf.readFileSync("./handlers/crumbs/igloo.json"),
    igloofloor = jf.readFileSync("./handlers/crumbs/igloofloor.json"),
    client = require('./client'),
    config = require('../config');
    error = require('./Errors.js');


var roomData = [];
var clients = [];
		
class room {
	
	constructor()
	{		
	}
	
	loadCrumbs()
	{
		for (var id in rooms)
			if(id < 900)
		{
			{
				roomData[id] = rooms[id]
				roomData[id]['users'] = [];
			}
		}
		
	}
	
	addUser(room, client, coords)
	{
		roomData[room].users.push(client);
		
		client.set('room', room),
		client.set('x', coords[0]),
		client.set('y', coords[1]);
		
		this.sendXt(room, ['ap', -1, client.buildPlayerString()]);
		
		if(room > 1000)
		{
			client.sendXt('jp', -1, room);
		}
	
	    if(this.getCount(room) < 1)
		{
			client.sendXt('jr', -1, room);
		}else
		{
			client.sendXt('jr', -1, room, this.buildRoomString(room));
		}
	}
	
	getIndex(element, array)
	{
		for(let i = 0; i < array.length; i++)
		{
			if(array[i] === element)
			{
				return i;
			}
		}
		
		return -1;
	}
	
	getCount(room)
	{
		let roomDataz = roomData[room].users;
		
		if(roomDataz)
		{
			return roomDataz.length;
		}else
		{
			return 0;
		}
	}
	
	getUsers(room)
	{
		if(roomData[room].users.length != 0 && roomData[room].users) return roomData[room].users;
	}
	
	removeUser(client)
	{
		let room = client.get('room')
		if(room)
		{
			if(roomData[room].users.length > 0)
			{
				let index = this.getIndex(client, roomData[room].users)
				
				if(index > -1)
				{
					roomData[room].users.splice(index, 1),
					this.sendXt(client.get('room'), ['rp', -1, client.get('ID')]);
				}
			}
		}
	}
	
	buildRoomString(room)
	{
		let users = this.getUsers(room), roomStr = '';
		
		for(let i in users)
		{
			roomStr += '%' + users[i].buildPlayerString();
		}
		
		return roomStr.substr(1);
	}
	
	sendData(room, data)
	{
		let users = this.getUsers(room);
		
		for(let i in users)
		{
			users[i].write(data);
		}
	}
	
	roomExists(room)
	{
		return roomData[room] ? true : false;
	}
	
	sendXt(room, data)
	{
		this.sendData(room, '%xt%' + data.join('%') + '%');
	}
	
	getRoom(room)
	{
		if(roomData[room]) return roomData[room]
	}
	
	createRoom(room)
	{
		let obj =
		{
			users: []
		}
		
		if(!roomData[room]) roomData[room] = obj
	}
	
};
		
new room().loadCrumbs();

module.exports = room;