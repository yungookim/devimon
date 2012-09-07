define ([], 
function(){
	var ConfigModel = Backbone.Model.extend({
		defaults : {
			email : '',
			isLogged : false,
			mode : 'off',
			keep_logged : false,
			sid : '',
			phone : ''
		},
		initialize : function(){
			var self = this;
			self.set('email', localStorage.getItem('email'));
			self.set('isLogged', false);
			self.set('mode', localStorage.getItem('mode'));
			self.set('keep_logged', localStorage.getItem('keep_logged'));
			self.set('sid', localStorage.getItem('sid'));
			self.set('phone', localStorage.getItem('phone'));

			if (self.get('sid')){
				$.post('/init', 
					{email : self.get('email'), sid : self.get('sid')}, 
					function(ret){
						if (ret === 'ok'){
							self.set('isLogged', true);
							self.save();
							window.Landing.render();
						}
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
				fn();
			});
		},

		off : function(){
			
		}


	});

	return ConfigModel;
});