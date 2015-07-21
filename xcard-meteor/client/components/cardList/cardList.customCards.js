
Template.customCards.helpers({
  unpackData: function() {
    var result = [];

    if( this.data ) {
      result = _.map(this.data, function(ele){
        return { card: ele, controls: this.controls }
      }.bind(this));
    }

    return result;
  },

  controlsTemplate: function() {
    return Template[this.controls]
  }
});
