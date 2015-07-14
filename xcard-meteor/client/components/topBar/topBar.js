
Template.topBar.events({
  "click li.home": function() {
    xCard.PageLoader.loadPage( "home" );
  },

  "click li.rooms": function() {
    xCard.PageLoader.loadPage( "room" );
  },
});
