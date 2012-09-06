define([
  'text!views/landing.html'
], function(template){
  var Landing = Backbone.View.extend({

    initialize : function(){
    	this.el = $('#container');
    },

    render: function(){
		var self = this;
		$(self.el).html(template);
    }

  });
  // Our module now returns an instantiated view
  // Sometimes you might return an un-instantiated view e.g. return Landing
  return new Landing;
});