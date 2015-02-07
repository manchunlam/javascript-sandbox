// Our Router

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  // Specify routes to match, and events to fire
  var AppRouter = Backbone.Router.extend({
    routes: {
      'users': 'showUsers',

      '*actions': 'defaultAction'
    }
  });

  // Constructor for the `router` module
  var initialize = function() {
    console.log('Router initialized');

    var app_router = new AppRouter();

    // Listen for the `showUsers` event
    app_router.on('route:showUsers', function() {
      console.log('Show a list of users');
    });

    app_router.on('route:defaultAction', function(route) {
      console.log("We don't recognize this route: " + route);
    });

    // Back button will work, and routes bookmark-able
    Backbone.history.start();
  };

  // Public interface to the `router` module
  return {
    initialize: initialize
  };
});
