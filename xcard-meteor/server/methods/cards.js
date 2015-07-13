// Card related methods
Meteor.methods({
  deleteCard: function(id) {
    if( id ) {
      CardsCollection.remove(id);
    }
  },

  removeCard: function(cardId) {
    var ownership = CardOwnershipCollection.findOne( { cardId: cardId } );
    if( ownership ) {
      CardOwnershipCollection.remove( ownership._id );
    }
  }
});
