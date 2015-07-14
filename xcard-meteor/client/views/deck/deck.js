
xCard.session.deckPageLoad = "xCard.deck.deckPageLoad";

Template.deckPage.events({
	"click .returnToMain": function() {
		xCard.PageLoader.loadPage( "home" );
	}
});

Template.deckPage.helpers({
  loadDeck: function(){
    var deck = UserDeckCollection.findOne( Session.get( xCard.session.deckPageLoad ) ),
        result = null;

    if( deck) {
      result = new DeckModel( deck );
    } else {
      xCard.PageLoader.loadPage( "home" );
    }

    return result;
  }
});

Template.deckPage.rendered = function(){
}
