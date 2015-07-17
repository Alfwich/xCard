var sendRoomChatMessage = function(msg,roomId) {
  RoomChatCollection.insert({
      owner: "server",
      name: "Server",
      roomId: roomId,
      msg: msg,
      created: new Date()
  });
}

var clientJoinedMessage = function(user, roomId) {
  sendRoomChatMessage(user.username + " has joined the room", roomId);
}

var sendGlobalChatMessage = function(msg) {
  _.foreach( RoomCollection.find().fetch(), function(room) {
    sendRoomChatMessage( room, room._id );
  });
}

Meteor.methods({
  createRoom: function(roomName) {
    if( roomName && Meteor.userId() ) {
      var roomId = RoomCollection.insert({ creator: Meteor.userId(), name: roomName });
      sendRoomChatMessage( "Room: '" + roomName + "' created on " + new Date(), roomId );
    }
  },

  joinRoom: function( roomId ) {
    var room = RoomCollection.findOne(roomId);
    if( room && this.userId ) {
      var membershipEntry = RoomMembershipCollection.findOne({ owner: Meteor.userId() });
      if( membershipEntry ) {
        if( membershipEntry.roomId != roomId ) {
          RoomMembershipCollection.update(membershipEntry._id, { $set: { roomId: roomId } });
          clientJoinedMessage(Meteor.user(), roomId);
        }
      } else {
        membershipEntry = {
          owner: Meteor.userId(),
          userName: Meteor.user().username,
          roomId: roomId
        };
        RoomMembershipCollection.insert( membershipEntry );
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

      RoomChatCollection.insert( chatMessageEntry );
    }

  }
});
