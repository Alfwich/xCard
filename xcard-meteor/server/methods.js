Meteor.methods({
  deleteCard: function(id) {
    if( !_.isUndefined(id) ) {
      CardsCollection.remove(id);
    }
  },

  acquireCard: function(userId, cardId) {
    if( !_.isUndefined(userId) && !_.isUndefined(cardId) ) {
      CardOwnershipCollection.insert({ owner: userId, cardId: cardId });
    }
  }
});
