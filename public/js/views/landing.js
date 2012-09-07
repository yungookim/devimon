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
  		'click #btn_phone_number' : 'get_phone_number',
      'click #logout' : 'logout'
  	},

    initialize : function(){
      //Register current view to global name space for access from model.
      window.Landing = this;
      window.socket;
    	this.model = new Config();
    },

    render: function(){
  		var self = this;
  		
  		$(self.el).html(Template);

  		if (self.model.get('isLogged')) {
  			var temp = $('#template-logged').html();
  			var html = Mustache.render(temp, self.model.toJSON());
  			$('#interact').html(html);

  			if (self.model.get('mode') == 'off'){
  				$('#onoff').removeClass('label-success');
  				$('#onoff').addClass('label-important');
  				$('#onoff').html('Offline');
          $('#onoff').popover('show')
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

    logout : function(){
      var self = this;
      $('#onoff').popover('hide');
      self.model.logout(function(){
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
    	self.model.save();
    	self.render();

      if (self.model.get('mode') === 'on'){
        window.socket = io.connect('/');
        var socket = window.socket;

        socket.emit('clientInfo', { 
          email : self.model.get('email'), 
          number: self.model.get('phone'), 
          sid : self.model.get('sid')
        });

        socket.on('init', function(data){
          console.log('connection established');
        }); 

        socket.on("error", function(data){
          console.log(data);
        });

      } else {
        console.log('close');
        window.socket.emit('client_close');
        window.socket.disconnect();
      }

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