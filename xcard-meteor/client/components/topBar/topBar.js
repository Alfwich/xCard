
Template.topBar.events({
  "click li.home": function() {
    xCard.PageLoader.loadPage( "home" );
  },

  "click li.rooms": function() {
    xCard.PageLoader.loadPage( "rooms" );
  },

  "click li.cards": function() {
    xCard.PageLoader.loadPage( "cards" );
  },

  "click li.decks": function() {
    xCard.PageLoader.loadPage( "decks" );
  },

  "click li.games": function() {
    xCard.PageLoader.loadPage( "games" );
  }

});
