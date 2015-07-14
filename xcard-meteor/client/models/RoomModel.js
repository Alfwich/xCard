// Room Model: Data representation of a room object
RoomModel = function(raw) {
  this._id = _.get(raw,"_id");
  this.name = _.get(raw,"name","");
}
