// Card related methods
Meteor.methods({
  deleteCard: function(id) {
    if( id ) {
      CardsCollection.remove(id);
    }
  }
});
