// Creates a new DeckModel object
DeckModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.cards = _.get(raw,"cards", []);
  this.name = _.get(raw,"name", "New Deck");

  this.processCards();
};

DeckModel.prototype.processCards = function() {
  // Generate an array of CardModels for each card in the deck
  this.cards = _(this.cards)
    .map( function(deckOwnership) {
      var ownership = CardOwnershipCollection.findOne(deckOwnership.ownershipId),
          card = "";

      if( ownership ) {
        card = new CardModel(CardCollection.findOne(ownership.cardId));
        card.count = deckOwnership.count;
      } else {
        console.warn( "Attempted to unpack ownership object which did not exist: " + deckOwnership.ownershipId);
      }

      return card;
    })
    .filter()
    .value();
}

DeckModel.prototype.addCard = function( card ) {
  var userOwnership = CardOwnershipCollection.findOne( { cardId: card._id } );

  if( userOwnership ) {
    Meteor.call("addCardToDeck", this._id, userOwnership._id );
  }

};

DeckModel.prototype.removeCard = function(card) {

  var userOwnership = CardOwnershipCollection.findOne( { cardId: card._id } );

  if( userOwnership ) {
    Meteor.call("removeCardFromDeck", this._id, userOwnership._id );
  }
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
