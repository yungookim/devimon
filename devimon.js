var app = require('express').createServer(),
    io = require('socket.io').listen(app),
    TwilioClient = require('twilio').Client,
    client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
			      'bb72ce3adfed239513c4ac8ead423feb', 
                              '69.164.219.86');
	
var MESSAGE = ", you should go check your device right now!";
var COUNTRY_NUMBER = {canada : '+16479316110'};

//these setters should be dynamic
io.set('heartbeat timeout', 5);
io.set('heartbeat interval', 5);
io.set('log level', 4);

app.listen(4000);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/html/index.html');
});

app.get('/devimon_client.js', function (req, res) {
	res.sendfile(__dirname + '/html/js/devimon_client.js');
});

app.get('/admin', function (req, res){
	//Count for number of current connections
	res.send("Number Connected : " + io.sockets.clients().length);
});

//Handler for each socket connection
io.sockets.on('connection', function (socket) {
	var NUMBER, NAME, CLOSE_REQUESTED;

	console.log(socket.namespace.manager.settings);

	//Initialize, check id&pass
	socket.on('clientInfo', function (data) {
		console.log("Number : " + data.number);
		if(data.pass != "wat!"){
			socket.emit("passErr", null);
			CLOSE_REQUESTED = true;
			socket.disconnect();
			return;
		}
		NUMBER = data.number;
		NAME = data.name;
		CLOSE_REQUESTED = false;

		socket.emit('init', { socket_id : socket.id, status : "ok"});
	});

	//Disconnect handler
	socket.on('disconnect', function () {
		console.log("close requested : " + CLOSE_REQUESTED);
		//Client illegal shut down
		if (CLOSE_REQUESTED == false){
			//This number has to change according to the Country
			var phone = client.getPhoneNumber(COUNTRY_NUMBER['canada']);
			phone.setup(function(){
				phone.sendSms(NUMBER, NAME + MESSAGE, null, function(result){
					if (result.smsDetails.status == 'queued'){
						//success
					} else {
						//sms failed
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
