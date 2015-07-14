
Meteor.methods({
  createRoom: function(roomName) {
    if( roomName && Meteor.userId() ) {
      RoomCollection.insert({ creator: Meteor.userId(), name: roomName });
    }
  }
});
