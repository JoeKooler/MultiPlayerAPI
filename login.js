const mongoose = require('mongoose');
let UserInfo = require('./Model/UserInfoSchema');
var socket;
var SocketDictionary = [];

mongoose.connect('mongodb://localhost:27017/unity', { useNewUrlParser: true, useUnifiedTopology: true });

const RegisterRequest = (sck) => {
    socket = sck;
    socket.on("OnRegister" , (data) => {
        const id = data['id'];
        const password = data['password'];
        Register(id,password);
    })
}

const LoginRequest = (sck) => {
    socket = sck;
    socket.on("OnLogin" , (data) => {
        const id = data['id'];
        const password = data['password'];
        Login(id,password);
    })
}
 
const Register = (id, password) => {
    UserInfo.findOne({ id: id }, (err, userInfo) => {
        if (err){
            RegisterFailed("Unexpected Error!");
            throw (err);
        }
        if (userInfo) {
            RegisterFailed("This Username is already exist!");
            // console.log(userInfo);
            // console.log(password + " comparing " + userInfo['password']);
            console.log("Already exist naja");
        } else {
            const user = new UserInfo({ id: id, password: password });
            user.save().then(() => {
                console.log("User has been created!");
                RegisterSuccess();
            });
        }
    })
}

const Login = (id, password) => {
    UserInfo.findOne({ id: id }, (err, userInfo) => {
        if (err){
            LoginFailed("Unexpected Error!");
            throw (err);
        }
        if (userInfo) {
            if(PasswordChecker(password,userInfo['password'])){
                SocketDictionary.push({
                    "socketID" : socket.id,
                    "userID" : id
                })
                // var thePair;
                // SocketDictionary.forEach(element => {
                //     console.log("eiei" + JSON.stringify(element));
                //     if(element.socketID == socket.id){
                //         console.log("KOKODAYO" + element.userID);
                //         thePair = element;
                //     }
                // });

                // console.log("Check ID " + thePair.userID);
                LoginSuccess();
            }else{
                LoginFailed("ID or Password is incorrect!");
            }
        } else {
            LoginFailed("ID has nowhere to be found!");
        }
    })
}

const RegisterFailed = (err) => {
    const result = {
        result : err
    }
    socket.emit("OnRegisterStatus", result);
}

const RegisterSuccess = () => {
    const result = {
        result : "Success"
    }
    socket.emit("OnRegisterStatus", result);
}

const LoginFailed = (err) => {
    const result = {
        result : err
    }
    socket.emit("OnLoginStatus", result);
}

const LoginSuccess = () => {
    const result = {
        result : "Success"
    }
    socket.emit("OnLoginStatus", result)
    socket.join("global");
}

const PasswordChecker = (inputPassword, actualPassword) => {
    if(inputPassword == actualPassword)
        return true;
    return false;
}

module.exports = {RegisterRequest, LoginRequest, SocketDictionary};