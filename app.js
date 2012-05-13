var app = require('express').createServer(),
	io = require('socket.io').listen(app),
	TwilioClient = require('twilio').Client,
	client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
				 'bb72ce3adfed239513c4ac8ead423feb', '69.164.219.86');
	
var MESSAGE = ", you should go check your device right now!";

//io.set('close timeout', 10);
io.set('heartbeat timeout', 30);

//io.set('log level', 3);
app.listen(4000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/html/index.html');
});

io.sockets.on('connection', function (socket) {
	var NUMBER, NAME, CLOSE_REQUESTED;
	socket.emit('cid', { id : socket.id, systime : Date.now()});
	socket.on('clientInfo', function (data) {
		console.log("Number : " + data.number);
//		socket.set('number', data.number);
//		socket.set('name', data.name);
//		socket.set('close_requested', false);	
			NUMBER = data.number;
			NAME = data.name;
			CLOSE_REQUESTED = false;
	});

	socket.on('disconnect', function () {
		console.log("close requested : " + CLOSE_REQUESTED);
		if (!CLOSE_REQUESTED){
			var phone = client.getPhoneNumber('+16479316110');
			phone.setup(function(){
				//phone.sendSms(NUMBER, NAME + MESSAGE, null, function(result){
					//console.log(result);
					console.log("assume txt msg sent");
					return;
					// if (call.smsDetails.status != 'queued'){
					//msging failed. try again after a few seconds?
					// }	
				//});
			});
		} else {
			console.log('log it and current socket is gone');
			return;
		}
	});
	socket.on('client_close', function(){
		CLOSE_REQUESTED = true;
		socket.disconnect();
	});
});
