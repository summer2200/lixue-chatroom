var gravatar = require('gravatar'),
    assert = require('assert');
var UserItem = require('../models/userItem');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var dateFormat = require('dateformat');

module.exports = function(app, io) {
    var users = {};//存储在线用户列表的对象
    // Initialize a new socket.io application, named 'chat'
    var chat = io.on('connection', function(socket) {

        //有人上线
        socket.on('online', function (data) {
          //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
          socket.name = data.user;
          //users 对象中不存在该用户名则插入该用户名
          if (!users[data.user]) {
            users[data.user] = data.user;
          }
          //向所有用户广播该用户上线信息
          io.sockets.emit('online', {users: users, user: data.user});
        });

        // Somebody left the chat
        socket.on('disconnect', function() {
            //若 users 对象中保存了该用户名
              if (users[socket.name]) {
                //从 users 对象中删除该用户名
                delete users[socket.name];
                //向其他所有用户广播该用户下线信息
                socket.broadcast.emit('offline', {users: users, user: socket.name});
              }
        });
    });

    //use namespace for modularity between user socket and chat socket
    var p2pchatNamespace = '/p2pchat';
    var p2pchat = io.of(p2pchatNamespace);
    p2pchat.on('connection', function(socket){
        console.log('p2p connection');

        socket.on('clientConnected', function(data) {
            console.log('p2p clientConnected');

            var room = findClientsSocket(io, data.id, p2pchatNamespace);
            // Only two people per room are allowed
            if (room.length < 2) {
                // Use the socket object to store data. Each client gets
                // their own unique socket object
                socket.username = data.username;
                socket.room = data.id;

                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) {
                    var usernames = [];
                    usernames.push(room[0].username);
                    usernames.push(socket.username);

                    // Send the startChat event to all the people in the
                    // room, along with a list of people that are in it.
                    p2pchat.in(data.id).emit('startChat', {
                        id: data.id,
                        users: usernames,
                    });
                }
            } else {
                console.log('too many people for room ' + data.id);
            }
        });

        // Somebody left the chat
        socket.on('disconnect', function() {
            console.log('p2p disconnect');
            socket.broadcast.to(this.room).emit('leave', {
                room: this.room,
                user: this.username,
            });
            // leave the room
            socket.leave(socket.room);
        });


        // Handle the sending of messages
        socket.on('msg', function(data) {
            console.log('p2p msg');
            // When the server receives a message, it sends it to the other person in the room.
            socket.broadcast.to(socket.room).emit('receive', { msg: data.msg, user: data.user, img: data.img });
        });
    });

    var groupChatNamespace = '/groupchat';
    var groupchat = io.of(groupChatNamespace);
    groupchat.on('connection', function(socket) {
        console.log('group connected');

        //save connected client info to room
        //broadcast member list of the room
        //TODO group chat
        socket.on('clientConnected', function(data) {
            // data:{id:roomid, username:username}

            //get member list already in the room
            var members = findClientsSocket(io, data.id, groupChatNamespace);

            joinRoom(socket, data);

            if (members.length > 0) {
                //notify client to update member list
                var usernames = [socket.username];
                members.forEach(function(item) {
                    usernames.push(item.username);
                });

                groupchat.in(data.id).emit('members', {
                    id: data.id,
                    users: usernames
                });
            }
        });

        // Handle the sending of messages
        socket.on('msg', function(data) {
            console.log('group msg');
            // When the server receives a message, it sends it to the other person in the room.
            // socket.broadcast.to(socket.room).emit('receive', { msg: data.msg, user: data.user, img: data.img });
            groupchat.in(socket.room).emit('receive', { msg: data.msg, user: data.user, img: data.img });
        });

        // Somebody left the chat
        socket.on('disconnect', function() {
            console.log('group disconnect');
            // leave the room
            // socket.leave(socket.room);

            //get member list already in the room
            var members = findClientsSocket(io, socket.username, groupChatNamespace);
            var usernames = [];
            members.forEach(function(item) {
                if (item.username === socket.username) {
                    return;
                }
                usernames.push(item.username);
            });

            groupchat.in(socket.room).emit('someoneLeave', {
                room: socket.room,
                user: socket.username,
                members: usernames
            });
        });
    });
};

function findClientsSocket(io, roomId, namespace) {
    var res = [],
        ns = io.of(namespace || "/"); // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if (roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId);
                if (index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}

//bind username, room to socket
//add socket to room
function joinRoom(socket, data) {
    // Use the socket object to store data. Each client gets
    // their own unique socket object
    socket.username = data.username;
    socket.room = data.id;

    // Add the client to the room
    socket.join(data.id);
}