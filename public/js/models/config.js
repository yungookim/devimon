define ([], 
function(){
	var ConfigModel = Backbone.Model.extend({
		defaults : {
			email : '',
			isLogged : false,
			mode : 'off',
			keep_logged : false,
			used : 0,
			sid : ''
		},
		initialize : function(){
			var self = this;
			window.config = self;

			if (localStorage.getItem('sid')){
				$.post('/init', 
					{email : localStorage.getItem('email'),
					 sid : localStorage.getItem('sid')}, 
					function(ret){
						if (ret === 'err'){
							console.log(ret);
							return;
							//Then just the default login kicks in.
						}
						self.set('isLogged', true);
						self.set('email', localStorage.getItem('email'));
						self.set('mode', 'off');
						self.set('keep_logged', localStorage.getItem('keep_logged'));
						self.set('sid', ret.session_id);
						if (ret.phone){
							self.set('phone', ret.phone);
						}
						self.set('used', ret.used);
						self.save();
						window.Landing.render();
				});
			}

		},

		save : function(fn){
			var self = this;
			if (!self.get('isLogged')){
				//self.set('keep_logged', false);
				self.set('mode', 'off');
			}
			if (localStorage){
				//Save every non-sensitive info in localStorage
				localStorage.setItem('email', self.get('email'));
				localStorage.setItem('phone', self.get('phone'));
				localStorage.setItem('isLogged', self.get('isLogged'));
				localStorage.setItem('mode', self.get('mode'));
				localStorage.setItem('keep_logged', self.get('keep_logged'));
				localStorage.setItem('sid', self.get('sid'));
			}
			console.log(self.toJSON());
		},

		login : function(email, pw, fn){
			var self = this;
			$.post('/login', {email : email, password : pw}, function(ret, status){
				if (ret.msg === "ok"){
					self.set('email', email);
					self.set('isLogged', true);
					self.set('sid', ret.sid);
					self.save();
					fn('ok');
				} else if ( ret.msg === 'pwerr' ){
					fn('pw');
				} else if ( ret === '500') {
					alert('Oops, something went wrong! I will fix it asap! Im so sorry!');
				}
			});
		},

		logout : function(fn){
			var self = this;
			$.post('/logout', {email : self.get('email')}, function(ret){
				self.set('isLogged', false);
				self.set('mode', 'off');
				self.set('sid', '');
				self.save();
				localStorage.clear();
				fn();
			});
		},

		save_number : function(){
			var self = this;
			$.post('/save_number', 
				{email : self.get('email'), 
				phone : self.get('phone'),
				sid : self.get('sid')},
				function(ret){
					//Doesnt have to do anything.					
				});
		}


	});

	return ConfigModel;
});