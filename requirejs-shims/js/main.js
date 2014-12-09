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

  define(['text!/templates/cars/list.html',
    'underscore',
    'backbone'], function(CarList, _, Backbone) {
      console.log(CarList);
      // string
      // "<h1>List of Cars</h1>"

      var myArray = [{ id: 123, name: 'foo' }, { id: 345, name: 'bar' }]
      console.log(_.where(myArray, { id: 123 }));
      // array
      // [{ id: 123, name: foo }]

      // Define a Backbone.Model class
      var Person = Backbone.Model.extend({
          initialize: function() {
            console.log('Person object initialized');
          }
        });

      // An object of Person, which is a Backbone.Model object
      var person = new Person({ name: 'Joe Lam', age: 31 });
      console.log(person.get('name'));
      // "Joe Lam"
  });
})();
