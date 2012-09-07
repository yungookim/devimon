//Web
var express = require('express');
var io = require('socket.io');
var dbCall = require('./dbCalls');

//Tools
var TwilioClient = require('twilio').Client;
var client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
			      'bb72ce3adfed239513c4ac8ead423feb', 
                              '69.164.219.86');
var uuid = require('node-uuid');
var sha1 = require('sha1');




var app = module.exports = express.createServer();
io.listen(app);

app.configure(function(){
 	app.use(express.static(__dirname + '/public'));	
 	app.use(express.bodyParser());
});


app.get('/', function (req, res) {
	res.render('index');
});


app.post('/login', function(req, res, msg) {
	dbCall.find_user(req.body.email, req.body.password, 
		function(err, ret){
		if (err){
			console.log(err);
			res.send('500');
			return;
		}

		//Password miss match
		if (ret === 'pwerr'){
			res.send({msg : 'pwerr'});
			return;
		}

		//Email DNE. Register as a new user
		if (ret === 'emailDNE'){
			//new user, create account
			dbCall.create_user(req.body.email, req.body.password, 
				function(err, ret){
					if (err){
						console.log(err);
						res.send('500');
						return;
					}
			});
		}

		var session_id = getSessionID();
		var msg = {
			msg : 'ok', 
			sid : session_id
		};
		dbCall.setSession(req.body.email, session_id);
		res.send(msg);
	});
});

app.post('/init', function(req, res){
	dbCall.getSession(req.body.email, req.body.sid, function(err, ret){
		if (err) {res.send('err'); return;};
		res.send('ok');
	});
});

app.post('/logout', function(req, res){
	dbCall.logout(req.body.email, function(){
		res.send('ok');
	});
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


function getSessionID(){
	return sha1(uuid.v4() + uuid.v4() + 'fj3fi3FF39fj3f9#f8s');
}

