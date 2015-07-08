Template.registerHelper( "disableNoUser", function() {
  return _.isNull( Meteor.userId() ) ? "disabled" : "";
});
