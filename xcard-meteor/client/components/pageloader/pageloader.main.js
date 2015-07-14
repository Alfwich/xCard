// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

xCard.PageLoader = {
  loadPage : function( page ) {
    // Only load a valid page is it is defined as a valid page
    if( _.isString(page) && page.length && _.contains( xCard.validPages, page ) ) {
      location.hash = page;
      Session.set( "xCard.currentPage", page + "Page" );
    } else {
      console.warn( "Attempted to loadPage: '" + page + "' but was not declared as a valid page. Valid pages: " + xCard.validPages );
    }
  }
}


// Setup hash navigation function
$(window).on( "popstate", function(){
  var dest = location.hash.substr(1);
  if( dest ) {
    xCard.PageLoader.loadPage( dest );
  }
});

location.hash = "main";
