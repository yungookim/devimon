var db = require('mysql-simple');
var uuid = require('node-uuid');
var sha1 = require('sha1');

var USER_TABLE = "user";
var DATA_TABLE = "data";

//Doc https://github.com/jhurliman/node-mysql-simple
db.init('web', 'web', 'devimon', 'localhost', 3306);

module.exports = {

  create_user : function(email, password, next){

	db.query('INSERT into ' + USER_TABLE + ' SET id=?, email=?, password=?',
		[uuid.v4(), email, password], 
		function (err, ret){
			if (err) {return next(err);}
			next(null, ret);
		});
  },

  find_user : function(email, next){
	db.querySingle('SELECT email, password FROM ' + USER_TABLE  + ' WHERE email=?',
		[email],
		function(err, ret){
			if (err) return next(err);
			if (!ret){
				return next(null, ret);
			}
			return next(null, ret);
		});
  },

  save_record : function(signature, nick, score, data, next){
	db.query('INSERT into ' + SCOREBOARD_TABLE + ' SET deviceID = ?, nick = ?, score = ?, data = ?',
	[signature, nick, score, data], 
	function(err, ret){
		if(err)return next(err);
		next(null, ret);
	});	
  }
};
