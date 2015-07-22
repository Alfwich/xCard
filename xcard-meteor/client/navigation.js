// Route all requests to the pageLoader template
Router.map( function(){
	this.route( "pageLoader", {
		path: /\/.*/
	});
});

// PpageLoader: Helpers and events for the page loader wrapper template
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
			return false;
    }

		return true;
  }
}

// Setup hash navigation function
$(window).on( "popstate", function(){
  var dest = location.hash.substr(1);
  if( dest ) {
    xCard.PageLoader.loadPage( dest );
  }
});

// Add the valid pages for the client application
xCard.validPages = [ "home", "rooms", "decks", "editDeck", "cards", "games", "game" ];
xCard.defaultPage = xCard.validPages[0];

document.title = "xCard Card Game";
