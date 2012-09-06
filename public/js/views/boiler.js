define([
  'text!views/main.html'
], function($, _, Backbone, mainTemplate){
  var mainTemplate = Backbone.View.extend({
    el: $('#container'),
    render: function(){
      
    }
  });
  // Our module now returns an instantiated view
  // Sometimes you might return an un-instantiated view e.g. return mainTemplate
  return new mainTemplate;
});