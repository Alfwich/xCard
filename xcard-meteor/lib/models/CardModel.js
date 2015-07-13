// Card model representation in Javascript. This allows us to abstract the
// representation of cards in memory away from their representation in the
// mongo database; giving us freedom to change the DOR schema as we see fit
CardModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.title = _.get(raw, "title", "No Title");
  this.body = _.get(raw, "body", "No Body");
  this.count = 1;
};

CardModel.prototype.acquireCard = function(cardId) {
  Meteor.call( "acquireCard", this._id );
}

CardModel.prototype.deleteCard = function(cardId) {
  Meteor.call( "deleteCard", this._id );
}
