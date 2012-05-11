var app = require('express').createServer(),
	io = require('socket.io').listen(app),
	TwilioClient = require('twilio').Client,
	client = new TwilioClient('AC724b4080ddd54f7b8f76c5635b7c13da',
				 'bb72ce3adfed239513c4ac8ead423feb', 'localhost:4000');
	
io.set('close timeout', 10);
io.set('heartbeat timeout', 10);

var MESSAGE = "Somebody or something has closed off your device's wifi connection, better go check!";

app.listen(4000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.emit('cid', { id : socket.id, systime : Date.now()});
  var NUMBER;//Make sure to have it in +1########## format
	socket.on('clientInfo', function (data) {
		console.log("id : " + data.id);
  	console.log("Number : " + data.number);
    NUMBER = data.number;
  	console.log("Password : " + data.pass);
	});
	socket.on('disconnect', function () { 
		console.log("Client disconnected ID : " + socket.id);
    console.log("Client disconnected Phone Number : " + NUMBER);
		var phone = client.getPhoneNumber('+16479316110');
    phone.setup(function(){
      phone.sendSms(NUMBER, MESSAGE, null, function(result){
        console.log(result);
          // if (call.smsDetails.status != 'queued'){
          //   //msging failed. try again after a few seconds?
          // }
      });
    });
    socket.on('close', function(){
      console.log('closed');
    });



	});
});