
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')


var index = require('./routes/index');
// Example route
// var user = require('./routes/user');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.view);
// Example route
// app.get('/users', user.list);

//global variable
users=[];

io.on('connection', function(socket){
  var userId = socket.id;
  createNewUser(userId);


  //when a user is discnnected
  socket.on('disconnect', function(){
    console.log('user disconnected');
    //case only one user
    deleteCurrentUser(userId);

  });

});

// need to make a new user json data with socket.id as userId
// then push a user object into users array
function createNewUser(userId){
  var newUser = {"id": userId};
  users.push(newUser);
  showUserArray();
}

// need to delete current user from users array
function deleteCurrentUser(userId){

  //case 1 only one user
  if (users.length == 1) {
    console.log(userId +' only one user were coneected');
    users=[];
    console.log('now ' + users.length + ' user in connected' );
  }
  else {
    //case 2 multiple users
    //console.log('mutiple users now');
    for (var i = 0; i < users.length; i++) {
      if(users[i].id == userId){
        //console.log('found a userId in users array at '+ i +'  need to delete it');
        //case 2-1
        //first user in users array
        if(i == 0)
        {
          //console.log(userId);
          //console.log('first user');
          users = users.slice(1, users.length);
          showUserArray();
          //console.log(users);
        }
        //case 2-2
        //since array starts at 0 index but users.length starts at 1.
        else if(i == users.length - 1 ){
          //console.log(userId);
          //console.log('last user');
          users = users.slice(0, users.length-1);
          showUserArray();
          //console.log(users);
        }
        //last user in users array
        //case 2-3
        // middle user in users array
        else{

          console.log('middle user');


          users.splice(i, 1);

          showUserArray();
          //console.log(users);
        }
        break;
      }
    }
  }

}
function showUserArray(){
  for (var i = 0; i < users.length; i++) {
    console.log(users[i]);
  }
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
