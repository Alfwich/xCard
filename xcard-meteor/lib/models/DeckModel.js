// Creates a new DeckModel object
DeckModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.cards = _.get(raw,"cards", []);
  this.name = _.get(raw,"name", "New Deck");

  this.processCards();
};

DeckModel.prototype.processCards = function() {
  // Generate an array of CardModels for each card in the deck
  // and removes empty cards
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
}

DeckModel.prototype.addCard = function( card ) {
  // Get an array of all ownershipIds for the deck
  var deckOwnershipIds = _.uniq( _.pluck( this.cards, "ownershipId") ),

  // Find a single cardOwnership object that is the requested card and not within the deck
      userOwnership = CardOwnershipCollection.findOne( { cardId: card._id, _id: { $nin: deckOwnershipIds } } );

  if(userOwnership) {
    Meteor.call("addCardToDeck", this._id, userOwnership._id );
  }

};

DeckModel.prototype.removeCard = function(card) {

  // Get an array of ownershipIds from the deck's cards where the card._id
  // is equal to the provided card._id
  var deckOwnershipIds = _.uniq( _.filter( _.map( this.cards, function(ele) {
    var result = "";

    if(ele._id == card._id) {
      result = ele.ownershipId;
    }

    return result;
  })));

  // If there is at least one card remove it from the deck
  if( deckOwnershipIds.length ) {
    Meteor.call("removeCardFromDeck", this._id, deckOwnershipIds[0] );
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
