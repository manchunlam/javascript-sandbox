(function() {
  console.log('/js/main.js')

  requirejs.config({
    baseUrl: '/js', // redundant, just for example
    shim: {
      underscore: {
        exports: '_'
      },
      jquery: {
        exports: '$'
      },
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      }
    },
    paths: {
      text: 'lib/text/text',
      underscore: 'lib/underscore/underscore',
      jquery: 'lib/jquery/dist/jquery',
      backbone: 'lib/backbone/backbone'
    }
  });

  define([
    'app'
  ], function(App) {
    App.initialize();
  });
})();
