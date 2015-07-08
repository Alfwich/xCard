// pageLoader.js: Helpers and events for the page loader wrapper template
// PageLoader template allows us to change and template without a page refresh
// Arthur Wuterich

xCard.PageLoader = {
  loadPage : function( page ) {
    // Only load a valid page is it is defined as a valid page
    if( _.contains( xCard.validPages, page ) ) {
      location.hash = page;
      Session.set( "xCard.currentPage", page + "Page" );
    }
  }
}


// Setup hash navigation function
$(window).on( "popstate", function(){
  var dest = location.hash.substr(1);
  xCard.PageLoader.loadPage( dest );
});
