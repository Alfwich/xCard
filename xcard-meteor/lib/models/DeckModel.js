// Creates a new DeckModel object
DeckModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.cards = _.get(raw,"cards", []);
  this.name = _.get(raw,"name", "New Deck");
}
