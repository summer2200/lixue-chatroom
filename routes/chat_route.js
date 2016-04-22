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

        // When the client emits the 'load' event, reply with the
        // number of people in this chat room

        socket.on('load', function(data) {

            var room = findClientsSocket(io, data);
            if (room.length === 0) {

                socket.emit('peopleinchat', { number: 0 });
            } else if (room.length === 1) {

                socket.emit('peopleinchat', {
                    number: 1,
                    user: room[0].username,
                    avatar: room[0].avatar,
                    id: data
                });
            } else if (room.length >= 2) {

                chat.emit('tooMany', { boolean: true });
            }
        });

        // When the client emits 'login', save his name and avatar,
        // and add them to the room
        socket.on('login', function(data) {
            var room = findClientsSocket(io, data.id);
            // Only two people per room are allowed
            if (room.length < 2) {
                // Use the socket object to store data. Each client gets
                // their own unique socket object
                socket.username = data.user;
                socket.room = data.id;
                socket.avatar = gravatar.url(data.avatar, { s: '140', r: 'x', d: 'mm' });
                // Tell the person what he should use for an avatar
                socket.emit('img', socket.avatar);
                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) {

                    var usernames = [],
                        avatars = [];

                    usernames.push(room[0].username);
                    usernames.push(socket.username);

                    avatars.push(room[0].avatar);
                    avatars.push(socket.avatar);
                    // Send the startChat event to all the people in the
                    // room, along with a list of people that are in it.
                    chat.in(data.id).emit('startChat', {
                        boolean: true,
                        id: data.id,
                        users: usernames,
                        avatars: avatars
                    });
                }
            } else {
                socket.emit('tooMany', { boolean: true });
            }
        });

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

        //p2p chat
        socket.on('p2pchat', function (data) {
            console.log(data);
          socket.emit('p2pchat', { user: data.user});
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
            // Notify the other person in the chat room
            // that his partner has left

            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room,
                user: this.username,
                avatar: this.avatar
            });

            // leave the room
            socket.leave(socket.room);


        });


        // Handle the sending of messages
        socket.on('msg', function(data) {

            // When the server receives a message, it sends it to the other person in the room.
            socket.broadcast.to(socket.room).emit('receive', { msg: data.msg, user: data.user, img: data.img });
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