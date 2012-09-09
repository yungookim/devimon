var db = require('mysql-simple');
var uuid = require('node-uuid');
var sha1 = require('sha1');

var USER_TABLE = "user";
var DATA_TABLE = "data";

//Doc https://github.com/jhurliman/node-mysql-simple
db.init('web', 'web', 'devimon', 'localhost', 3306);

module.exports = {

  create_user : function(email, password, next){
  	password = sha1('1E2EioAZIDTQwwneAsX6!dfan' + password + '1E2EioAZIDTQwwneAsX6!EF!dfn');

	db.query('INSERT into ' + USER_TABLE + ' SET id=?, email=?, password=?',
		[uuid.v4(), email, password], 
		function (err, ret){
			if (err) {return next(err);}
			next(null, ret);
		});
  },

  find_user : function(email, password, next){
  	password = sha1('1E2EioAZIDTQwwneAsX6!dfan' + password + '1E2EioAZIDTQwwneAsX6!EF!dfn');

	db.querySingle('SELECT email, password FROM ' + USER_TABLE  + ' WHERE email=?',
		[email],
		function(err, ret){
			if (err) return next(err);

			if(ret == null){
				return next(null, 'emailDNE');
			}

			if (password != ret.password){
				return next(null, 'pwerr');
			}
			return next(null, ret);
		});
  },

  setSession : function(email, session_id){
  	db.query('UPDATE ' + USER_TABLE + ' SET session_id=? WHERE email=?',
  		[session_id, email], function(err){
  			if (err){
  				console.log(err);
  				return;
  			}
  		});
  },

  getSession : function(email, session_id, fn){
  	db.querySingle('SELECT email, session_id, phone, used FROM ' + USER_TABLE  + ' WHERE email=? AND session_id=?',
  		[email, session_id], function(err, ret){
			if (err) return fn(err);
			return fn(null, ret);
  		});
  },

  logout : function(email, fn){
  	db.query('UPDATE ' + USER_TABLE + ' SET session_id=""', function(err, ret){
  		//Assume log out was possible. Client will be logged out regardless of the result
  		fn();
  	});
  },

  get_used : function(email, fn){
  	db.querySingle('SELECT used from ' + USER_TABLE + ' WHERE email=?',
  		[email], function(err, ret){
  			if (err) {console.log(err); return fn(err)};
  			return fn(null, ret);
  		});
  },

  used_increament : function(email, fn){
  	db.query('UPDATE ' + USER_TABLE + ' SET used=used+1 WHERE email=?',
  		[email], function(err){
  			if (err){
  				console.log(err);
  				return;
  			}
  		});
  },

  save_number : function(email, phone, sid){
  	db.query('UPDATE ' + USER_TABLE + ' SET phone=? WHERE email=? AND session_id=?',
  		[phone, email, sid], function(err, ret){
  			if (err){
  				console.log(err);
  			}
  			return;
  		});

  }

 //  save_record : function(signature, nick, score, data, next){
	// db.query('INSERT into ' + SCOREBOARD_TABLE + ' SET deviceID = ?, nick = ?, score = ?, data = ?',
	// [signature, nick, score, data], 
	// function(err, ret){
	// 	if(err)return next(err);
	// 	next(null, ret);
	// });	
 //  }
};
