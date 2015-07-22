xCard.session.filterPrefix = "xCard.dynamic.filterBar.filterString.";

Template.filterBar.events({
  "keyup .filter": function(e) {
    if( this.filterId ) {
      Session.set( xCard.session.filterPrefix + this.filterId, e.currentTarget.value );
    }
  }
});

Template.filterBar.helpers({
  "filterText": function() {
    var result = "";

    if( this.filterId ) {
      result = Session.get(xCard.session.filterPrefix + this.filterId);
    }
    
    return result;
  }
});
