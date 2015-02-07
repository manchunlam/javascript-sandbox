define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var User = Backbone.Model.extend({
    url: '/data/user.json',

    initialize: function(options) {
    }
  });

  return User;
});
