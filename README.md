# BingoJS-New

BingoJS is an AS2 emulator written in NodeJS with the aim of being the fastest, stable and the most secure emulator out there in the CPPS community. The source code is open-source, as development goes on, the source will be made more stable, secure and absolutely exploit free. As of now, the development is going pretty well and most of the handlers are complete.

The source itself works in an unique way and has its own unique way of handling things in a more secure and stable manner. Database queries are handled securely which nearly makes MySQL injection impossible,  the database queries have been optimized which means the queries are really-really fast at updating a specific data, in other words it won't lag the game even a  one bit. The main purpose of this source is to help other users in the community to build their own emulators, contributions are accepted, most of the bugs have been fixed as well.  The source itself is written in a simple manner to help users gain more knowledge about what's actually happening during client-side and server-side communication, which would definitely help newbies understand more about the client itself.

This source is under development and is using MD5 for testing purposes until the source is complete, use it at your own risk

# Updates

Basic handlers like Message communication, room joining,  heartbeat, etc... are done

Login server & Game Server: Functional

Server population(It has a total of 5 bars and updates when the number of user in that specific server increases): Functional

Room system(Joining a room, game room or leaving a room): Functional

Buddy system(Adding people, removing them, finding  a specific person if he/she is in your buddy list or also check if  they are online when on the server page): Functional

Ignore system(Adding people to ignored list and removing them): Functional

Mini-games(Games like hydro-hopper, etc.. give out correct coins): Functional

Plugins(A bot and a command plugin): Functional

Igloo system(Buying furniture, saving them or buying igloos, etc..): Functional

Item system(Inventory, adding items, etc..): Functional

Ban, kick and mute(Can only be used when a specific user is a moderator and a system for checking if the user is a moderator has also been implemented): Functional

Rank System(Changes the badge on your player-card, goes from 1-6): Functional
                                                                             
                                                                             
Security stuff

Preventing multiple users from trying to login in the same account(If a user is already logged in the same account, it won't allow any other user to login)

Player-string injection has also been patched

Undefined bots are patched

Database queries are safe from the use of MySQL injection.
