// Card model representation in Javascript. This allows us to abstract the
// representation of cards in memory away from their representation in the
// mongo database; giving us freedom to change the DOR schema as we see fit
CardModel = function(raw) {
  if( _.isObject(raw)) {
    this.title = raw.title;
    this.body = raw.body;
  }
}
