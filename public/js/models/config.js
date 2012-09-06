define ([], 
function(){
	var ConfigModel = Backbone.Model.extend({
		defaults : {
			email : '',
			phone : '',
			isLogged : false,
			mode : 'off',
			keep_logged : false			
		},
		initialize : function(){
		
		},

		fetch : function(e, fn){
			
		},

		save : function(fn){
			var self = this;
			if (!self.get('isLogged')){
				self.set('keep_logged', false);
				self.set('mode', 'off');
			}
			if (localStorage){
				//Save every non-sensitive info in localStorage
				localStorage.setItem('email', self.get('email'));
				localStorage.setItem('phone', self.get('phone'));
				localStorage.setItem('isLogged', self.get('isLogged'));
				localStorage.setItem('mode', self.get('mode'));
				localStorage.setItem('keep_logged', self.get('keep_logged'));
			}
			console.log(localStorage);
		}
	});

	return ConfigModel;
});