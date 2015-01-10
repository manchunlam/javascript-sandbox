// Application Entry Point

define([
  'router'
], function(Router) {
  // Constructor for the `app` module
  var initialize = function() {
    console.log('App initialized');

    Router.initialize();
  }

  // Public interface for the `app` module
  return {
    initialize: initialize
  };
});
