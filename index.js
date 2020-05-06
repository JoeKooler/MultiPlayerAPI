var { RegisterRequest, LoginRequest, SocketDictionary } = require('./login');
var { ClientUpdateMove, BulletUpdateMove, Die, Alive } = require('./ingame');
var { CreateLobby, JoinLobby, LeaveLobby, UpdateLobby, Lobbies, LobbyData, ToGame, RequestUpdate, RequestUpdateInGameUpdate } = require('./lobby');
var { ClientChatUpdate } = require('./chat');
var io = require("socket.io")(5055);



io.on("connection", (socket) => {
    console.log('client connected');
    console.log(socket.id);
    ClientConnect(io, socket);
    ClientUpdateMove(io, socket);
    BulletUpdateMove(io, socket);
    ClientChatUpdate(io, socket);
    RegisterRequest(socket);
    LoginRequest(socket);
    RequestUpdate(io, socket);
    RequestUpdateInGameUpdate(socket);
    CreateLobby(io, socket);
    JoinLobby(io, socket);
    LeaveLobby(io, socket);
    UpdateLobby(io, socket);
    ToGame(io, socket);
    Die(io, socket);
    Alive(io, socket);

    socket.on("disconnect", () => {
        console.log("client disconnected : " + socket.id);
        ClientDisconnect(io, socket);
    });
})

const ClientConnect = (io, socket) => {
    var data = {
        "uid": socket.id
    };
    socket.emit("OnOwnerClientConnect", data);
}

const ClientDisconnect = (io, socket) => {
    var id;
    var roomName;

    SocketDictionary.forEach(element => {
        console.log("eiei" + JSON.stringify(element));
        if (element.socketID == socket.id) {
            id = element.userID;
        }
    });

    console.log("That guy >_> " + id + " just left :<");
    console.log("LobbyData" + LobbyData);

    if (id != undefined && LobbyData != undefined) {
        for (var key in LobbyData) {
            console.log("Key " + key);
            LobbyData[key].forEach(element => {
                console.log("Element " + element.id);
                if (id == element.id) {
                    roomName = key;
                    console.log("Roomname " + key);
                    LobbyData[roomName] = LobbyData[roomName].filter(item => item.id !== element.id)
                    LobbyData[roomName] = LobbyData[roomName].filter(item => item.id !== undefined)
                    if (LobbyData[roomName].length <= 0) {
                        Lobbies = Lobbies.filter(item => item !== roomName)
                        console.log("Lobbies " + Lobbies);
                    }
                }
            });
        }
    }
    // console.log("Last length " + LobbyData[roomName].length);
}

