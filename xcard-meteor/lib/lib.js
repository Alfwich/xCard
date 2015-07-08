// xCard namespace
xCard = {}

// Function to delete the _id field of an object
removeId = function(ele) {
  if( ele && ele["_id"] ) {
    delete ele["_id"];
  }
  return ele;
}
