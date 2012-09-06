define([
  'views/landing'
  // 'views/about',
  // 'views/FAQ',
  // 'models/config'
], function(Landing, About, Faq, Config){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'about': 'renderAbouts',
      'faq' : 'renderFaq',

      // Default
      "*actions": 'defaultAction'
    },

    about : function(){


    },

    faq : function(){

    },

    defaultAction : function(){
      Landing.render();
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});