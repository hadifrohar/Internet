var express = require('express');
var router = express.Router();
const userData = require('../controllers/userData');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.IsLogged)
    return res.redirect('/login');

  res.render('index', {pageTitle: 'GitHub Search'});
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Save github user */
router.post('/save', userData.save);

/* Delete github user */
router.post('/delete', userData.delete);

/* Get saved users */
router.get('/getSaved', userData.getSaved);

/* Logout */
router.post('/logout', function(req, res, next)
{
  req.session.destroy()
  res.redirect('/login')
});

module.exports = router;
