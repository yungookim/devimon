define([
	'models/config',
	'text!views/landing.html'
], function(Config, Template){
  var Landing = Backbone.View.extend({
  	el : $('#container'),

  	events : {
  		'click #login_signup' : 'login',
  		'click #keep_logged_in' : 'keep_logged',
  		'click #onoff' : 'switch',
  		'click #btn_phone_number' : 'get_phone_number'
  	},

    initialize : function(){
    	this.model = new Config();
    },

    render: function(){
		var self = this;
		
		$(self.el).html(Template);

		if (self.model.get('isLogged'))
		{
			var temp = $('#template-logged').html();
			var html = Mustache.render(temp, self.model.toJSON());
			$('#interact').html(html);

			if (self.model.get('mode') == 'off'){
				$('#onoff').removeClass('label-success');
				$('#onoff').addClass('label-important');
				$('#onoff').html('Offline');
			} else {
				$('#onoff').removeClass('label-important');
				$('#onoff').addClass('label-success');
				$('#onoff').html('Talking');
			}
		}
    },

    login : function(){
    	var self = this;
    	var email = $('#email').val();
    	var pw = $('#pw').val();

    	self.model.login(email, pw, function(ret){
    		if (ret != 'ok'){
    			alert("Wrong email or password!");
    		}
    		self.render();
    	});
    },

    keep_logged : function(){
    	var self = this;
    	self.model.set('keep_logged', true);
    	self.model.save();
    },

    //Turn on or off socket.io
    switch : function(){
    	var self = this;
    	self.model.get('mode') == 'off' ? self.model.set('mode', 'on') : self.model.set('mode', 'off');
    	self.model.off();
    	self.model.save();
    	self.render();
    },

    get_phone_number : function(){
    	var number = $('#input_phone_number').val();
    	this.model.set('phone', number);
    	this.model.save();
    	this.render();
    }

  });
  // Our module now returns an instantiated view
  // Sometimes you might return an un-instantiated view e.g. return Landing
  return new Landing;
});