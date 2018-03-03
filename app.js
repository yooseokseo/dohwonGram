
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


//
var currentUserList = require('./currentUsersList.json');
var dataList = require('./dataList.json');
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


// global variable
app.use(function(req, res, next){

  next();
});



io.on('connection', function(socket){
  var userId = socket.id;
  createNewUser(userId);


  //when a user is disconnected
  socket.on('disconnect', function(){
    console.log('user ' +socket.id +' disconnected');
    deleteCurrentUser(userId);

  });

});

// need to make a new user json data with socket.id as userId
// then push a user object into users array
function createNewUser(userId){
  var defaultNumberOfRandomPlayItems  = 10;
  var randomNumList = createRandomList(defaultNumberOfRandomPlayItems);
  console.log(randomNumList);
  var newUser = {
    "id": userId,
    loginStatus : false,
    defaultNumberOfRandomPlay : defaultNumberOfRandomPlayItems,
    randomNumList : randomNumList
  };
  createRandomList(defaultNumberOfRandomPlayItems);
  currentUserList.push(newUser);
  showUsersArray();
}

// need to delete current user from users array
function deleteCurrentUser(userId){

  //case 1 only one user
  if (currentUserList.length == 1) {
    currentUserList=[];
    showUsersArray();
  }
  else {
    //case 2 multiple users
    //console.log('mutiple users now');
    for (var i = 0; i < currentUserList.length; i++) {
      if(currentUserList[i].id == userId){
        //console.log('found a userId in users array at '+ i +'  need to delete it');
        //case 2-1
        //first user in users array
        if(i == 0)
        {
          users = currentUserList.slice(1, currentUserList.length);
          showUsersArray();
        }
        //case 2-2
        //since array starts at 0 index but users.length starts at 1.
        else if(i == currentUserList.length - 1 ){
          currentUserList = currentUserList.slice(0, currentUserList.length-1);
          showUsersArray();
        }
        //last user in users array
        //case 2-3
        // middle user in users array
        else{
          currentUserList.splice(i, 1);
          showUsersArray();
        }
        break;
      }
    }
  }

}
// show current users Arrys
function showUsersArray(){
  for (var i = 0; i < currentUserList.length; i++) {
    console.log(currentUserList[i].id);
  }
}
function createRandomList(numberOfRandomPlayItems){
  var tempNumofItems = 30;
  var randomNum = -1;
  var randomNumList = [];
  //first random number into randomList
  randomNum = Math.floor(Math.random() * Math.floor(tempNumofItems));
  randomNumList.push(randomNum);

  // since first random number is already pushed so numberOfRandomPlayItems -1 iterations
  for (var i = 0; i < numberOfRandomPlayItems -1; i++) {

      randomNum = Math.floor(Math.random() * Math.floor(tempNumofItems));
      foundDuplicates = foundDuplicatesinRandomNumList(randomNum, randomNumList);

      while(foundDuplicates){
        randomNum = Math.floor(Math.random() * Math.floor(tempNumofItems));
        foundDuplicates = foundDuplicatesinRandomNumList(randomNum, randomNumList);
      }
      randomNumList.push(randomNum);



  }
  //console.log(randomNumList);
  return randomNumList;


}
function foundDuplicatesinRandomNumList(randomNum, randomNumList) {
  //console.log('current random list = '+randomNumList);
  if(randomNumList.length == 0){
    return false;
  }
  else{
    for (var i = 0; i < randomNumList.length; i++) {
      if(randomNumList[i] == randomNum){
        //console.log('duplicates found');
        return true;
      }
      else {
        //console.log('no duplicates. good to go');
        //console.log('current random list = '+randomNumList);

      }
    }
    return false;
  }

}
function insertNewItem(userId, categoryTitle){
  var wholeNumberOfDataList = dataList.length;
  console.log(wholeNumberOfDataList);
};

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
