module.exports = class UserCollection {

    constructor() {
        this._userArray = [];
    }

    addUser(username, socketObj) {
        let newName = username + '#' + Math.floor(Math.random() * 100000);
        socketObj.userId = newName;
        this._userArray.push(socketObj);
        return socketObj;
    };

    removeUser(user) {
        for (let i = 0; i < this._userArray.length; i++) {
            let currElement = this._userArray[i];
            if (currElement.userId === user) {
                return user;
            };
        };
    }
}