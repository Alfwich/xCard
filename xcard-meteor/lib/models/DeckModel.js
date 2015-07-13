// Creates a new DeckModel object
DeckModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.cards = _.get(raw,"cards", []);
  this.name = _.get(raw,"name", "New Deck");

  // Generate an array of CardModels for each card in the deck
  this.cards = _.filter( _.map( this.cards, function(ele){
    var ownership = CardOwnershipCollection.findOne( ele ),
        result = "";

    if( ownership ) {
      var card = CardsCollection.findOne( ownership.cardId );

        if( ownership && card ) {
          result = new CardModel( card );
          result.ownershipId = ownership._id;
        }
      } else {
        console.warn("Attempted to unpack deck with invalid cardId: " + ele);
      }

      return result;
  }));


};

DeckModel.prototype.addCard = function( ownershipId ) {
  //TODO: Make this function with a cardId rather than an ownershipId.
  //      This would work such that a check would be made to see if there is
  //      an available card from the user's owned cards, thats NOT already
  //      present in the current deck, and add it to this deck.
  Meteor.call("addCardToDeck", this._id, ownershipId);
};

DeckModel.prototype.changeName = function( newName ) {
  Meteor.call( "updateDeck", this._id, { name: newName } );
};

DeckModel.prototype.editDeck = function() {
	Session.set( xCard.session.deckPageLoad, this._id );
	xCard.PageLoader.loadPage( "deck" );
}

DeckModel.prototype.removeDeck = function() {
	Meteor.call( "removeDeck", this._id );
}

DeckModel.prototype.removeCard = function( ownershipId ) {
  //TODO: Make this function with a cardId rather than an ownershipId.
  //      See Above
  Meteor.call("removeCardFromDeck", this._id, ownershipId);
};
