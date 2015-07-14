
Meteor.methods({
  createRoom: function(roomName) {
    if( roomName && Meteor.userId() ) {
      RoomCollection.insert({ creator: Meteor.userId(), name: roomName });
    }
  },

  joinRoom: function( roomId ) {
    var room = RoomCollection.findOne(roomId);
    if( room ) {
      var membershipEntry = RoomMembership.findOne({ owner: Meteor.userId() });
      if( membershipEntry ) {
        RoomMembership.update(membershipEntry._id, { $set: { roomId: roomId } });
      } else {
        membershipEntry = { owner: Meteor.userId(), roomId: roomId };
        RoomMembership.insert( membershipEntry );
      }
    }
  }
});
