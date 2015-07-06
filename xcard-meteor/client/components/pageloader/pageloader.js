// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

Meteor.startup( function() {


  xCard.PageLoader = {
    validPages : [ "main" ],
    loadPage : function( page ) {

      // Only load a valid page is it is defined as a valid page
      if( _.contains( this.validPages, page ) ) {
        location.hash = page;
        xCard.Session.set( "xCard.currentPage", page + "Page" );
      }
    }
  }


  // Setup hash navigation function
  $(window).on( "popstate", function(){
    var dest = location.hash.substr(1);
    xCard.PageLoader.loadPage( dest );
  });
});

Template.pageLoader.events( {
});

Template.pageLoader.helpers( {
  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = xCard.Session.get("xCard.currentPage"),
        result = { template : Template["mainPage"] }

    if( _.isString(page) && Template[page] !== undefined ) {
      result.template = Template[page];
    }

    return result;
  }
});

Template.pageLoader.rendered = function() {
}
