const mongoose = require('mongoose');
let UserScore = require('./Model/UserScoreSchema');

var ClientUpdateMove = (io,socket) => {
    socket.on("OnClientUpdateMove" , (data) => {
        console.log(data);
        var roomName = data['roomName'];
        var playerID = data['id'];
        var playerNumber = data['playerNumber'];
        var x = data['x'];
        var y = data['y'];
        var angle = data['angle'];
        var lobbyMovement = {
            id : playerID,
            playerNumber : playerNumber,
            x : x,
            y : y,
            angle : angle,
        }
        console.log("Emitting " + lobbyMovement);
        io.to(roomName).emit("UpdateMove", lobbyMovement);
    })
}

var BulletUpdateMove = (io,socket) => {
    socket.on("OnBulletUpdateMove" , (data) => {
        var roomName = data['roomName'];
        var bulletName = data['bulletName'];
        var x = data['x'];
        var y = data['y'];
        var angle = data['angle'];
        var bulletMovement = {
            bulletName : bulletName,
            x : x,
            y : y,
            angle : angle,
        }
        io.to(roomName).emit("UpdateBullet", bulletMovement);
    })
}

var Die = (io,socket) => {
    socket.on("Die", (data) => {
        var roomName = data['roomName'];
        var id = data['uid'];

        UserScore.findOne({ id: id }, (err, userScore) => {
            if (err){
                throw (err);
            }
            if (userScore) {
                userScore.score() -= 5;
                userScore.save().then(() => console.log("Saved new score "));
            }
        })
        var info = {
            "id" : id
        }
        io.to(roomName).emit("DieStatus", info);
        socket.leave(roomName);
        socket.join("global");
    })
}

var Alive = (io,socket) => {
    socket.on("Alive", (data) => {
        var roomName = data['roomName'];
        var id = data['uid'];

        UserScore.findOne({ id: id }, (err, userScore) => {
            if (err){
                throw (err);
            }
            if (userScore) {
                userScore.score() += 5;
                userScore.save().then(() => console.log("Saved new score "));
            }
        })
        var info = {
            "id" : id
        }
        io.to(roomName).emit("BacktoLobby", info);
        socket.leave(roomName);
        socket.join("global");
    })
}

module.exports = { ClientUpdateMove, BulletUpdateMove, Die, Alive }