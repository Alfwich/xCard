// Card related methods
Meteor.methods({
  deleteCard: function(id) {
    if( id ) {
      CardCollection.remove(id);
    }
  }
});
