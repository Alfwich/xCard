Meteor.methods({
  deleteCard: function(id) {
    if( id ) {
      CardsCollection.remove(id);
    }
  },

  acquireCard: function(cardId) {
    if( Meteor.userId() && cardId ) {
      CardOwnershipCollection.insert({ owner: Meteor.userId(), cardId: cardId});
    }
  },

  removeCard: function(ownershipId) {
    if( ownershipId ) {
      CardOwnershipCollection.remove( ownershipId );
    }
  }
});
