define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var InvalidUser = Backbone.Model.extend({
    url: '/data/invalid_user.json',

    initialize: function(options) {
    },

    validate: function(attrs, options) {
      if (_.isEmpty(attrs.firstname)) {
        return "firstname cannot be blank";
      }
    }
  });

  return InvalidUser;
});
