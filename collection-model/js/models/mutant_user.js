define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var MutantUser = Backbone.Model.extend({
    url: '/data/mutant_user.json',

    initialize: function(options) {
    },

    parse: function(response, options) {
      return response.data;
      // or
      // return {
      //   firstname: response.data.firstname,
      //   lastname: response.data.lastname,
      //   age: response.data.age
      // };
    }
  });

  return MutantUser;
});
