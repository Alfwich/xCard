// CardOwnership related methods
Meteor.methods({
  acquireCard: function(cardId) {
    if( Meteor.userId() && cardId ) {
      CardOwnershipCollection.insert({ owner: Meteor.userId(), cardId: cardId});
    }
  }
});
