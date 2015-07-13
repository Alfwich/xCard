
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
