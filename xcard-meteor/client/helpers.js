
var ifTrueThen = function( condition, result ) {
  return condition ? result : "";
};

Template.registerHelper( "disableNoUser", function() {
  return _.isNull( Meteor.userId() ) ? "disabled" : "";
});

Template.registerHelper( "userId", function() {
  return Meteor.userId();
});

Template.registerHelper( "equals", function(a,b) {
  return a == b;
});

Template.registerHelper( "ifTrue", function(a,result) {
  return ifTrueThen( a, result );
});

Template.registerHelper( "ifFalse", function(a,result) {
  return ifTrueThen( !a, result );
});

Template.registerHelper( "isArray", function(a) {
  return _.isArray(a);
});

Template.registerHelper( "isString", function(a) {
  return _.isString(a);
});

Template.registerHelper( "isDefined", function(a) {
  return !_.isUndefined(a);
});

Template.registerHelper( "isUndefined", function(a) {
  return _.isUndefined(a);
});
