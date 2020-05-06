
const ClientChatUpdate = (io , socket) => {    
    socket.on("OnClientSendMessage" , (data) => {
        console.log(socket.id);
        var sender = data['sender'];
        var message = data['message'];
        var channel = data['channel'];
        var updateChat = {
            "sender" : sender,
            "message" : message
        };
        console.log(message);
        console.log("Channel " + channel);
        io.to(channel).emit("OnClientChatUpdate", updateChat);
    })
}

module.exports = { ClientChatUpdate }