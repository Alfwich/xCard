
Template.registerHelper( "getTemplate", function( template ) {
  var result = null;

  if( template ) {
    result = _.extend( { t: Template[template] }, this );
  }

  return result;
});

Template.registerHelper( "loadTemplate", function() {
  return this.t || Template[null];
});

Template.registerHelper( "unpackData", function(){
  var result = [];

  // Unpack the data and add each this property to each element of the data.
  if( this.data ) {
    var src = this.data;
    delete this.data;
    result = _.map( src, function(ele){
        return _.extend( { data: ele }, this );
    }.bind(this));
  }

  return result;
});
