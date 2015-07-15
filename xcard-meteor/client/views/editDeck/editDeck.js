
xCard.session.deckPageLoad = "xCard.editDeck.deckPageLoad";

Template.editDeckPage.helpers({
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
