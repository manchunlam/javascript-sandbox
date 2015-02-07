// Application Entry Point

define([
  'router',
  'models/user',
  'models/mutant_user',
  'models/invalid_user'
], function(Router, User, MutantUser, InvalidUser) {
  // Constructor for the `app` module
  var initialize = function() {
    console.log('App initialized');

    Router.initialize();

    var helloWorld = new User({ firstname: 'hello', lastname: 'world',
      age: 31 });
    console.log(helloWorld.attributes);

    var user = new User();
    user.fetch();
    user.on('change', function(model, options) {
      console.log(model.attributes);
    });

    var mutantUser = new MutantUser();
    mutantUser.fetch();
    mutantUser.on('change', function(model, options) {
      console.log(model.attributes);
    });

    var invalidUser = new InvalidUser();
    invalidUser.fetch({ validate: true });
    invalidUser.on('invalid', function(model, error) {
      console.log("Error is: " + error);
      console.log("Validation Error is: " + model.validationError);
    });

    var fooBar = new User({ firstname: 'foo', lastname: 'bar', age: 31 });
    fooBar.set({ lastname: 'something', age: 29 });
    fooBar.save();
    console.log(fooBar.attributes);
  }

  // Public interface for the `app` module
  return {
    initialize: initialize
  };
});
