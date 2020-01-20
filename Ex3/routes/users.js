var express = require('express');
var router = express.Router();


class GithubUser {
  constructor(login)
  {
    this.login = login;
  }

  getLogin = () => this.login;
}

var users = []; //contains all saved users

/**
 * @param login: username
 * @returns the index of the user in the users array if found, otherwise -1
 */
function getIndex(login) {
  const fixUser = (str) => str.replace(/\s+/g,'').trim().toLowerCase();

  for(i=0; i<users.length; i++){
    if(fixUser(users[i].getLogin()) === fixUser(login))
      return i;
  }

  return -1;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// POST method: save github user to the server
router.post('/save', function(req, res, next)
{
  if(getIndex(req.body.username) !== -1)
    res.status(400).json({msg: 'Username already saved!'});
  else {
    users.push(new GithubUser(req.body.username));
    res.status(200).json({msg: 'User \'' + req.body.username + '\' saved!'});
  }

});

// POST method: deletes github user from the server
router.post('/delete', function(req, res, next)
{
  const index = getIndex(req.body.username);
  if(index === -1)
    res.status(404).json({msg: 'No such username!'});
  else {
    users.splice(index, 1);
    res.status(200).json({msg: 'User \'' +req.body.username+ '\' deleted!'});
  }

});

//GET method: retrieves saved usernames
router.get('/getSaved', function(req, res, next)
{
  res.status(200).json({users: users});
});



module.exports = router;
