// Card related methods
Meteor.methods({
  deleteCard: function(id) {
    if( id ) {
      CardsCollection.remove(id);
    }
  },
  
  removeCard: function(ownershipId) {
    if( ownershipId ) {
      CardOwnershipCollection.remove( ownershipId );
    }
  }
});
