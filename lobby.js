var Lobbies = [];
var LobbyData = {};

const CreateLobby = (io, socket) => {
    socket.on("OnCreateLobby", (data) => {
        var roomName = data['roomName'];
        var creator = data['creator'];
        if (!Lobbies.includes(roomName)) {
            console.log("Lobbies are before " + Lobbies);
            Lobbies.push(roomName);
            LobbyData[roomName] = []
            LobbyData[roomName].push({ "id": creator });
            console.log("Create and Push to Lobbydata " + JSON.stringify(LobbyData));
            console.log("Create and Push to Lobbydata[roomName] " + LobbyData[roomName]);
            // for(var key in LobbyData){
            //     console.log("Key " + LobbyData[key]);
            //     LobbyData[key].forEach(element => {
            //         console.log("Element " + element.id);
            //     });
            // }
            socket.join(roomName, () => {
                socket.leave("global");
                RoomUpdate(io, socket, roomName);
                socket.emit("OnCreateLobbySuccess");
            })
        }
    })
}

const JoinLobby = (io, socket) => {
    socket.on("OnJoinLobby", (data) => {
        var roomName = data['roomName'];
        var playerID = data['id'];
        console.log("Roomname" + JSON.stringify(data));

        if (LobbyData[roomName] === undefined) {
            LobbyData[roomName] = [];
        }
        if (LobbyData[roomName].length < 2) {
            LobbyData[roomName].push({ "id": playerID })
            socket.join(roomName, () => {
                var data = {
                    "roomName": roomName,
                    "count": LobbyData[roomName].length
                }
                // console.log("Emit room name :" + data["roomName"]);
                socket.emit("OnJoinLobbySuccess", data);
                RoomUpdate(io, socket, roomName);
                socket.leave("global");
            })
        } else {
            var data = {
                "err": "The room is full now naja!"
            }
            socket.emit("OnJoinLobbyFailed", data);
        }
    })
}

const LeaveLobby = (io, socket) => {
    socket.on("OnLeaveLobby", (data) => {
        var roomName = data['roomName'];
        var playerID = data['id'];
        socket.join("global");
        socket.leave(roomName);
        LobbyData[roomName] = LobbyData[roomName].filter(item => item.id !== playerID)
        LobbyData[roomName] = LobbyData[roomName].filter(item => item.id !== undefined)
        console.log("Lobby counter " + LobbyData[roomName].length);
        if (LobbyData[roomName].length <= 0) {
            console.log("Deleting Lobby " + roomName);
            Lobbies = Lobbies.filter(item => item !== roomName)
        }
        console.log("Try'na leave");
        RoomUpdate(io, socket, roomName);
        socket.emit("OnLeaveSuccess");
    })
}

const RequestUpdate = (io, socket) => {
    socket.on("OnRequestRoomUpdate", (data) => {
        console.log("Got Request :< ");
        var roomName = data['roomName'];
        RoomUpdate(io, socket, roomName);
    })
}

const RequestUpdateInGameUpdate = (socket) => {
    socket.on("OnInGameRequestUpdate", (data) => {
        var roomName = data['roomName'];
        var lobbyInfo = {
            lobbyData: LobbyData[roomName]
        }
        console.log("Emit to socket " + socket.id);
        socket.emit("OnInGameInfoUpdate", lobbyInfo);
    })
}

const RoomUpdate = (io, socket, roomName) => {
    var lobbyInfo = {
        lobbyData: LobbyData[roomName]
    }
    console.log("Trying to send update");
    io.to(roomName).emit("OnRoomUpdate", lobbyInfo)
}

const UpdateLobby = (io, socket) => {
    socket.on("OnUpdateLobbyRequest", (data) => {
        var lobbyUpdate = {
            "lobby": Lobbies
        }
        console.log(lobbyUpdate);
        socket.emit("OnUpdateLobby", lobbyUpdate);
    })
}

const ToGame = (io, socket) => {
    socket.on("OnToGo", (data) => {
        var roomName = data['roomName'];
        io.to(roomName).emit("gogogo")
    })
}

module.exports = { CreateLobby, JoinLobby, LeaveLobby, UpdateLobby, RequestUpdate, ToGame, RequestUpdateInGameUpdate, Lobbies, LobbyData };