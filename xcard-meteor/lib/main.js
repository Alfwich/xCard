
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

// Processes a card array by removing duplicate cards, and updating the count
// attribute for each card left in the array
xCard.helpers.groupCards = function(arr) {

  console.log( arr );
  // Combine the cards into groups with _id as the ordered attribute
  arr = _.groupBy( _.filter( arr ), function(ele) {
    return ele._id;
  });

  // Flatten the card array and update the count for each card
  arr = _.map( arr, function(ele) {
    var card = ele[0];
    card.count = ele.length;
    return card;
  });

  return arr;
}
