const db = require('../models');
const validation = require('../public/javascripts/validation')


/* Login request */
exports.login = function(req, res) {

    //validate data for security
    if (!validation.isValidUser(req.body.username) || !validation.isValidPassword(req.body.password))
        return res.status(500).json({msg: 'Error occurred, please try again!'});

    //find user in database, if found, check if password is correct. if correct then the user authenticated
    db.User.findOne({where: {login: req.body.username}}).then(prod => {
        if(prod == null)
            res.status(404).json({msg: 'No such username!'});
        else if(prod.password !== req.body.password)
            res.status(400).json({msg: 'Incorrect password!'});
        else
        {
            if(req.body.remember) //default is one hour, if user chooses remember me it will be 1000 hours
                req.session.cookie.maxAge = 3600000*1000;

            req.session.IsLogged = true;
            req.session.username = req.body.username;
            res.status(200).json({msg: 'Login success!'});

        }
    });
}

/* Register request */
exports.register = function(req, res) {

    //validate data for security
    if (!validation.isValidUser(req.body.username) || !validation.isValidPassword(req.body.password))
        return res.status(500).json({msg: 'Error occurred, please try again!'});

    //find user in database, if not found, create new one with the passed parameters and authenticate user.
    db.User.findOne({where: {login: req.body.username}}).then(prod => {
        if(prod != null)
            res.status(400).json({msg: 'Username already registered!'});
        else
        {
            if(req.body.remember)
                req.session.cookie.maxAge = 3600000*1000;

            db.User.create({login: req.body.username, password: req.body.password, savedUsers: ''}); //create new user
            req.session.IsLogged = true;
            req.session.username = req.body.username;
            res.status(200).json({msg: 'Registration success!'});
        }
    });
}