Template.pageLoader.helpers( {

  // Attempts to load the template provided by its name
  loadPage : function() {
    var page = Session.get("xCard.currentPage"),
        result = { template : Template[xCard.defaultPage + "Page"] }

    if( _.isString(page) && page.length && Template[page] !== undefined ) {
      result.template = Template[page];
    }

    return result;
  }
});

Template.pageLoader.events({
  "click a": function(e) {
    if(xCard.PageLoader.loadPage( $(e.currentTarget).attr("href") )) {
      e.preventDefault();
    }
  }
})

Template.pageLoader.rendered = function() {
  var dest = location.hash.substr(1);
  if( dest ) {
    xCard.PageLoader.loadPage( dest );
  }
}
