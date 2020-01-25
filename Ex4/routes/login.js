var express = require('express');
var router = express.Router();
const authenticator = require('../controllers/Authenticator');

/* GET home page. */
router.get('/login', function(req, res, next) {
    if(req.session.IsLogged) //checks if authenticated, otherwise asks from user to login
        return res.redirect('/');
    res.render('login', {pageTitle : 'GitHub Search - Login'});
});


/* Login request */
router.post('/login', authenticator.login);

/* Registration request */
router.post('/register', authenticator.register);

module.exports = router;
