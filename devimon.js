//Web
var express = require('express');
var io = require('socket.io');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var dbCall = require('./dbCalls');
var sha1 = require('sha1');

//Tools
var TwilioClient = require('twilio').Client;
var client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
			      'bb72ce3adfed239513c4ac8ead423feb', 
                              '69.164.219.86');
var app = module.exports = express.createServer();
io.listen(app);


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	dbCall.find_user(user.email, function (err, ret) {
		done(err, ret);
	});
});


passport.use(new LocalStrategy(
  function(email, password, done) {

  	password = sha1('hdQrBEeZfMWfecy0cz3c' + password + '9tgwfJcjKXzs4yR9RQq3');

    dbCall.find_user(email, function (err, ret) {
      if (err) { return done(err); }
      if (!ret) {
      	console.log('unknown user. create new');
      	dbCall.create_user(email, password, function(err, ret){
      		if (err) { return done(err);}
      		return done(null, ret);
      	});
      	return;
      }
      else if (ret.password != password) {
      	console.log('Wrong pass');
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, ret);
    });
  }
));

app.configure(function(){
	app.use(express.cookieParser());
 	app.use(express.static(__dirname + '/public'));	
 	app.use(express.bodyParser());
 	app.use(express.session({ secret: '1vAGxZcZz9bGS0RmwXij' }));
	app.use(passport.initialize());
	app.use(passport.session());
});

app.get('/', passport.authenticate('local'), function (req, res) {
	console.log(req.isAuthenticated());
	res.render('index');
});

app.post('/login', passport.authenticate('local'),
  function(req, res, msg) {
  	res.send('ok');
  });



app.get('/admin', function (req, res){
	//Count for number of current connections
	res.send("Number Connected : " + io.sockets.clients().length);
});

app.listen(4000);

//these setters should be dynamic
// io.set('heartbeat timeout', 5);
// io.set('heartbeat interval', 5);
// io.set('log level', 4);

var MESSAGE = ", you should go check your device right now!";
var COUNTRY_NUMBER = {canada : '+16479316110'};

// //Handler for each socket connection
// io.sockets.on('connection', function (socket) {
// 	var NUMBER, NAME, CLOSE_REQUESTED;

// 	console.log(socket.namespace.manager.settings);

// 	//Initialize, check id&pass
// 	socket.on('clientInfo', function (data) {
// 		console.log("Number : " + data.number);
// 		if(data.pass != "wat!"){
// 			socket.emit("passErr", null);
// 			CLOSE_REQUESTED = true;
// 			socket.disconnect();
// 			return;
// 		}
// 		NUMBER = data.number;
// 		NAME = data.name;
// 		CLOSE_REQUESTED = false;

// 		socket.emit('init', { socket_id : socket.id, status : "ok"});
// 	});

// 	//Disconnect handler
// 	socket.on('disconnect', function () {
// 		console.log("close requested : " + CLOSE_REQUESTED);
// 		//Client illegal shut down
// 		if (CLOSE_REQUESTED == false){
// 			//This number has to change according to the Country
// 			var phone = client.getPhoneNumber(COUNTRY_NUMBER['canada']);
// 			phone.setup(function(){
// 				phone.sendSms(NUMBER, NAME + MESSAGE, null, function(result){
// 					if (result.smsDetails.status == 'queued'){
// 						//success
// 					} else {
// 						//sms failed
// 					}
// 					return;
// 				});
// 			});
// 		} else if (CLOSE_REQUESTED == true){
// 			console.log('current socket is goner');
// 			return;
// 		} else {
// 			console.log("client trying to reconnect after illegal shutdown");
// 			return;
// 		}
// 	});

// 	socket.on('client_close', function(){
// 		CLOSE_REQUESTED = true;
// 		socket.disconnect();
// 	});
// });


