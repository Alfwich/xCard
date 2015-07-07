// Card model representation in Javascript. This allows us to abstract the
// representation of cards in memory away from their representation in the
// mongo database; giving us freedom to change the DOR schema as we see fit
CardModel = function(raw) {
  if( _.isObject(raw)) {
    this._id = _.get(raw,"_id");
    this.title = _.get(raw, "title", "No Title");
    this.body = _.get(raw, "body", "No Body");
  }
}
