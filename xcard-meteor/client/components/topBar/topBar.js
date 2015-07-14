
Template.topBar.events({
  "click li.home": function() {
    xCard.PageLoader.loadPage( "main" );
  },

  "click li.rooms": function() {
    xCard.PageLoader.loadPage( "room" );
  },
});
