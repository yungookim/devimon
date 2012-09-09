//Web
var express = require('express');
var dbCall = require('./dbCalls');

//Tools
var uuid = require('node-uuid');
var sha1 = require('sha1');
var io = require('socket.io');
var TwilioClient = require('twilio').Client;
var client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
			      'bb72ce3adfed239513c4ac8ead423feb', 
                              '69.164.219.86');

var app = module.exports = express.createServer();
io = io.listen(app);

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
		res.send(ret);
	});
});

app.post('/logout', function(req, res){
	dbCall.logout(req.body.email, function(){
		res.send('ok');
	});
});

app.post('/get_used', function(req, res){
	dbCall.get_used(req.body.email, function(err, ret){
		if (err) {return res.send('err');}
		res.send(ret);
	});
});

app.post('/save_number', function(req, res){
	dbCall.save_number(req.body.email, req.body.phone, req.body.sid);
	res.send('ok');
});

app.get('/admin', function (req, res){
	//Count for number of current connections
	res.send("Number Connected : " + io.sockets.clients().length);
});



app.listen(80);

//these setters should be dynamic
io.set('heartbeat timeout', 6);
io.set('heartbeat interval', 3);
io.set('log level', 4);

var MESSAGE = "This is Devimon. It seems that your device may be at risk!";
var COUNTRY_NUMBER = {canada : '+16479316110'};

//Handler for each socket connection
io.sockets.on('connection', function (socket) {
	var CLOSE_REQUESTED;
	var phone_numb;
	// console.log(socket.namespace.manager.settings);

	//Initialize, check id&pass
	socket.on('clientInfo', function (data) {
		// console.log(data);
		phone_numb = data.phone;

		dbCall.used_increament(data.email, function(err, ret){
			console.log(err);
		});

		//Check session and basic validation
		dbCall.getSession(data.email, data.sid, function(err, ret){
			if (err){
				socket.emit("error", null);
				CLOSE_REQUESTED = true;
				socket.disconnect();
				return;
			}
			if (!ret){
				socket.emit("error", null);
				CLOSE_REQUESTED = true;
				socket.disconnect();
				return;
			}
		});

		CLOSE_REQUESTED = false;
		socket.emit('init', { socket_id : socket.id, status : "ok"});
	});

	//Disconnect handler
	socket.on('disconnect', function () {
		console.log("close requested : " + CLOSE_REQUESTED);
		//Client illegal shut down
		if (CLOSE_REQUESTED == false){
			// This number has to change according to the Country
			var phone = client.getPhoneNumber(COUNTRY_NUMBER['canada']);
			phone.setup(function(){
				phone.sendSms(phone_numb, MESSAGE, null, function(result){
					if (result.smsDetails.status == 'queued'){
						//success
						console.log('SMS sent to ' + phone_numb);
					} else {
						//sms failed
						console.log('SMS error with ' + phone_numb);
					}
					return;
				});
			});
			
		} else if (CLOSE_REQUESTED == true){
			console.log('current socket is goner');
			return;
		} else {
			console.log("client trying to reconnect after illegal shutdown");
			return;
		}
	});

	socket.on('client_close', function(){
		CLOSE_REQUESTED = true;
		socket.disconnect();
	});
});

function getSessionID(){
	return sha1(uuid.v4() + uuid.v4() + 'fj3fi3FF39fj3f9#f8s');
}

