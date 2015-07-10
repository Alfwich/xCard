// Creates a new DeckModel object
DeckModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.cards = _.get(raw,"cards", []);
  this.name = _.get(raw,"name", "New Deck");

  this.cards = _.filter( _.map( this.cards, function(ele){
    var ownership = CardOwnershipCollection.findOne( ele ),
        card = CardsCollection.findOne( ownership.cardId ),
        result = "";

      if( ownership && card ) {
        result = new CardModel( card );
        result.ownershipId = ownership._id;
      }

      return result;
  }));
}
