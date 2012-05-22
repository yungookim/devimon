var socket;
function init_socket(){
	console.log("click");
	var numb = document.getElementById('phoneNumb').value;
	var _name = document.getElementById("name").value;
	var _pass = document.getElementById("pass").value;
	if (numb){
	socket = io.connect('/');
	socket.emit('clientInfo', { id : 'kimy', 
		name : _name, 
		number: numb, 
		pass :  _pass});
	socket.on('init', function(data){
	  setStatus('connection established');
	  console.log(data);
	}); 
	socket.on("passErr", function(){
	  console.log("passErr");
	  setStatus("Wrong Password");
	});
	} else {alert("enter number man-_-");}
}

function disconnect(){
	socket.emit('client_close');
	setStatus('service disabled');
	socket = null;
	socket.disconnect();
}

function setStatus(status){
	document.getElementById('status').innerHTML = status;
}

