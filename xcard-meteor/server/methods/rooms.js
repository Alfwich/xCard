var sendServerChatMessage = function(msg,roomId) {
  RoomChat.insert({
      owner: "server",
      name: "Server",
      roomId: roomId,
      msg: msg,
      created: new Date()
  });
}

var clientJoinedMessage = function(user, roomId) {
  sendServerChatMessage(user.username + "has joined the room", roomId);
}

var sendGlobalChatMessage = function(msg) {

}

Meteor.methods({
  createRoom: function(roomName) {
    if( roomName && Meteor.userId() ) {
      RoomCollection.insert({ creator: Meteor.userId(), name: roomName });
    }
  },

  joinRoom: function( roomId ) {
    var room = RoomCollection.findOne(roomId);
    if( room && this.userId ) {
      var membershipEntry = RoomMembership.findOne({ owner: Meteor.userId() });
      if( membershipEntry ) {
        RoomMembership.update(membershipEntry._id, { $set: { roomId: roomId } });
        clientJoinedMessage(Meteor.user(), roomId);
      } else {
        membershipEntry = {
          owner: Meteor.userId(),
          userName: Meteor.user().username,
          roomId: roomId
        };
        RoomMembership.insert( membershipEntry );
        clientJoinedMessage(Meteor.user(), roomId);
      }
    }
  },

  // Meteor.call("sendChatMessage", this._id, msg);
  sendChatMessage: function( roomId, msg ) {
    var room = RoomCollection.findOne( roomId );

    if( this.userId && room && ( _.isString(msg) || _.isString(msg._str)) && msg.length) {
      var chatMessageEntry = {
        owner: this.userId,
        name: Meteor.user().username,
        roomId: roomId,
        msg: msg,
        created: new Date()
      };

      RoomChat.insert( chatMessageEntry );
    }

  }
});
