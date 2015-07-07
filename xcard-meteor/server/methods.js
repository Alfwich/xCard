Meteor.methods({
  deleteCard: function(id) {
    if( !_.isUndefined(id) ) {
      CardsCollection.remove(id);
    }
  }
});
