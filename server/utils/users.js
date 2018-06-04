"use strict";
function Users() {
    this.users = [];
}

Users.prototype.addUser = function(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
};

Users.prototype.removeUser = function(id) {
    // find the index of the user with that id
    let indexToRemove = this.users.findIndex((user) => user.id === id);
    // copy the user before remove to use later
    let userCopyToRemove = Object.assign({}, this.users[indexToRemove]);
    // remove the user from the list
    this.users.splice(indexToRemove, 1);
    // return the copy of the removed user
    return userCopyToRemove;
};

Users.prototype.getUser = function(id) {
    // find and return the user with that id
    return this.users.find((user) => user.id === id);
};

Users.prototype.getUserList = function(room) {
    // get the users in that particular room
    var usersList = this.users.filter((user) => user.room === room);
    // return an array of the names of each user
    return usersList.map((user) => user.name); 
};

module.exports = Users;
