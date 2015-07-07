Meteor.methods({
  deleteCard: function(id) {
    if( !_.isUndefined(id) ) {
      CardsCollection.remove(id);
    }
  },

  acquireCard: function(cardId) {
    if( !_.isUndefined(Meteor.userId()) && !_.isUndefined(cardId) ) {
      // TODO: Do validation of userId and cardId
      CardOwnershipCollection.insert({ owner: Meteor.userId(), cardId: cardId });
    }
  },

  removeCard: function(ownershipId) {
    if( !_.isUndefined(ownershipId)) {
      CardOwnershipCollection.remove( ownershipId );
    }
  }
});
