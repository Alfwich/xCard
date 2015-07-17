// CardOwnership related methods
Meteor.methods({
  acquireCard: function(cardId) {
    if( Meteor.userId() ) {
      var ownership = CardOwnershipCollection.findOne( { owner: Meteor.userId(), cardId: cardId } );
      if( ownership ) {
        ownership.count += 1;
        CardOwnershipCollection.update( ownership._id, { $set: { count: ownership.count } } );
      } else {
        CardOwnershipCollection.insert( { owner: Meteor.userId(), cardId: cardId, count: 1 } );
      }
    }
  },

  removeCard: function(cardId) {
    var ownership = CardOwnershipCollection.findOne( { owner: Meteor.userId(), cardId: cardId } );
    if( ownership ) {
      ownership.count -= 1;
      if( ownership.count ) {
        CardOwnershipCollection.update( ownership._id, { $set: { count: ownership.count } } );
      } else {
        CardOwnershipCollection.remove( ownership._id );
      }
    }
  }
});
