
xCard.session.deckPageLoad = "xCard.deck.deckPageLoad";

Template.deckPage.events({
	"click .returnToMain": function() {
		xCard.PageLoader.loadPage( "main" );
	}
});

Template.deckPage.helpers({
  loadDeck: function(){
    var deck = UserDecks.findOne( Session.get( xCard.session.deckPageLoad ) ),
        result = null;

    if( deck) {
      result = new DeckModel( deck );
    } else {
      xCard.PageLoader.loadPage( "main" );
    }

    return result;
  }
});

Template.deckPage.rendered = function(){
}
