xCard.session.currentRoomId = "xCard.rooms.currentRoomId";

Template.roomsPage.events({
  "click .addNewRoom": function() {
    Meteor.call( "createRoom", prompt( "Please enter Room name") );
  },

  "click .room": function() {
    this.joinRoom();
  }
});

Template.roomsPage.helpers({
  rooms: function() {
    var result = RoomCollection.find().fetch();

    result = _.map( result, function(ele) {
      return new RoomModel(ele);
    });

    return result;
  },

  roomData: function() {
    var roomMembership = RoomMembership.findOne(),
        result = {};

    if( roomMembership ) {
      result = new RoomModel(RoomCollection.findOne(roomMembership.roomId))
      Session.set(xCard.session.currentRoomId, result._id);
    }

    return result;
  }
});
