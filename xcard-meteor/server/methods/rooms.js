
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
      } else {
        membershipEntry = { owner: Meteor.userId(), roomId: roomId };
        RoomMembership.insert( membershipEntry );
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
