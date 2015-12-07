var express = require('express'); // create a new Web app
var app = express();
// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname));



var chessDatabase = [
  {name: 'Feroz',password: 'Cartoon4', email: 'frauf@u.rochester.edu',progress:''},
];



app.post('/users', function (req, res) {
  var postBody = req.body;
  var myName = postBody.name;
  postBody.progress = '';
  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }

  // check if user's name is already in database; if so, send an error
  for (var i = 0; i < chessDatabase.length; i++) {
    var e = chessDatabase[i];
    if (e.name == myName) {

      res.send('ERROR');
      return; // return early!
    }
  }
  // otherwise add the user to the database by pushing (appending)
  // postBody to the fakeDatabase list
  if(postBody.email.length<3)
  {
	postBody.email = "WHYYYYYYYYY!";
  }
  chessDatabase.push(postBody);

  res.send('OK');
});
app.post('/save/*', function (req, res) {
  var postBody = req.body;
  var name = postBody.name;
  var progress = postBody.progress;
  if (!name) {
    res.send('ERROR');
    return; // return early!
  }
  // check if user's name is already in database; if so, send an error
  for (var i = 0; i < chessDatabase.length; i++) {
    var e = chessDatabase[i];
    if (e.name == name) {
		e.progress = progress;
		res.send('OK');
		return; // return early!
    }
  }
  res.send('ERROR');
});
app.post('/delete/*', function (req, res) {
  var postBody = req.body;
  var name = postBody.name;
  var progress = postBody.progress;
  if (!name) {
    res.send('ERROR');
    return; // return early!
  }
  // check if user's name is already in database; if so, send an error
  for (var i = 0; i < chessDatabase.length; i++) {
    var e = chessDatabase[i];
    if (e.name == name) {
      chessDatabase.splice(i,1);
      res.send('OK');
    return; // return early!
    }
  }
  res.send('ERROR');
});

app.get('/users/*', function (req, res) {
  var name = req.params[0];
  // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  for (var i = 0; i < chessDatabase.length; i++) {
    var e = chessDatabase[i];
    if (e.name == name) {
      res.send(e);
      return; // return early!
    }
  }
  res.send('{}'); // failed, so return an empty JSON object!
});
var http = require('http').Server(app);
http.listen(3000, function(){
  console.log('listening on *:3000');
});