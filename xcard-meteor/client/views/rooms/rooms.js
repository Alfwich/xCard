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

  room: function() {
    var sessionRoomId = Session.get(xCard.session.currentRoomId),
        room = new RoomModel(RoomCollection.findOne(sessionRoomId));

    return room;
  },

  isSelected: function() {
    return Session.get(xCard.session.currentRoomId) == this._id ? "selected" : "";
  }

});


RoomMembership.find().observe({
    added: function(ele) {
      if( ele.owner == Meteor.userId() ) {
        Session.set(xCard.session.currentRoomId, ele.roomId);
        // Subscribe to the rooms chat
        Meteor.subscribe("roomChat", ele.roomId);
      }
    }
});
