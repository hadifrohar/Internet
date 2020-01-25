const db = require('../models');


/**
 * Search for user in database
 * @param username: desired user
 * @returns username object
 */
let getUser = (username) => db.User.findOne({where: {login: username}});

/**
 * Add GitHub user to the saved list
 * @param username: github user to add
 * @param savedUsers: saved list
 * @returns {string}: returns the list with new username added
 */
function addUser(username, savedUsers){
    if(savedUsers == null || savedUsers.length === 0)
        return username + ',';
    else
        return savedUsers + username + ',';
}

/**
 * Delete GitHub user from saved list
 * @param username: username to delete
 * @param savedUsers: saved list
 * @returns {void | string}: return the list without the username
 */
function deleteUser(username, savedUsers){
    if(savedUsers == null || savedUsers.length === 0)
        return;
    else
        return savedUsers.replace(username+',', '');
}

//Responds to request with the saved GitHub users list
exports.getSaved = function(req, res) {
    getUser(req.session.username).then(prod => {
        if(prod == null)
            res.status(500).json({msg: 'Error occurred!'});
        else
            res.status(200).json({users: prod.savedUsers.slice(0,-1)});
    });
}

//Saves username to GitHub users list. It checks if username is saved, if not it will update the list in database
//with the new username
exports.save = function(req, res) {
    getUser(req.session.username).then(prod => {
        if(prod == null)
            res.status(500).json({msg: 'Error occurred!'});
        else {
            if(prod.savedUsers != null && prod.savedUsers.includes(req.body.username+','))
                res.status(400).json({msg: 'Username already saved!'});
            else {
                prod.update({
                    savedUsers: addUser(req.body.username, prod.savedUsers)
                });
                res.status(200).json({msg: 'User \'' + req.body.username + '\' saved!'});
            }
        }
    });
}

//Deletes username from GitHub users list of a specific user. It checks if the user in the list, if yes it will
//update the list without the user.
exports.delete = function(req, res) {
    getUser(req.session.username).then(prod => {
        if(prod == null)
            res.status(500).json({msg: 'Error occurred!'});
        else {
            if(prod.savedUsers != null && !prod.savedUsers.includes(req.body.username+','))
                res.status(404).json({msg: 'No such username!'});
            else {
                prod.update({
                    savedUsers: deleteUser(req.body.username, prod.savedUsers)
                });
                res.status(200).json({msg: 'User \'' + req.body.username + '\' deleted!'});
            }
        }
    });
}
