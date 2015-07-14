
Template.roomsPage.events({
  "click .addNewRoom": function() {
    Meteor.call( "createRoom", prompt( "Please enter Room name") );
  },

  "click .room": function() {
    console.log( "Should join room" );
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
    return {};
  }
});
