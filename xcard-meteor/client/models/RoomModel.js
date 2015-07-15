// Room Model: Data representation of a room object
RoomModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.name = _.get(raw,"name","");
}

RoomModel.prototype.joinRoom = function() {
  Session.set(xCard.session.currentRoomId, this._id);
  // Subscribe to the rooms chat
  Meteor.subscribe("roomChat", this._id);
  Meteor.call("joinRoom", this._id);
}

RoomModel.prototype.sendChatMessage = function(msg) {
  Meteor.call("sendChatMessage", this._id, msg);
}
