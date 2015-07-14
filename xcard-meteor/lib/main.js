
// Function to delete the _id field of an object
xCard.helpers.removeId = function(ele) {
  if( ele && ele["_id"] ) {
    delete ele["_id"];
  }
  return ele;
}

// Returns the value for a given key on the global object.
xCard.helpers.globalObject = function(k) {
  return window[k];
};

// Returns an array of CardModels for each owned card of the user.
// If run on the server will return all owned cards for all users.
// [filterString]: Will perform a filter on the title of the card and return
//                 only cards which contain the filterString
xCard.helpers.getAllUserCards = function(filterString) {
  var result = CardOwnershipCollection.find({}).fetch(),
      filterRegex = RegExp(".*" + (filterString||"") + ".*","gi");

  // Populate the card for each ownership entry
  result = _(result).map( function(ele) {
    var card = new CardModel( CardCollection.findOne( {
      _id: ele["cardId"],
      title: { $regex: filterRegex }
    }));
    card.count = ele.count;
    return card;
  }).filter( function(ele) {
    return ele.title.length;
  }).value();

  return result;
}
