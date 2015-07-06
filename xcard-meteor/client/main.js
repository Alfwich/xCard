xCard = {
	// Session wrapper to allow up to wrap xCard
	// session variables with the proper namespace
	Session : {
		set : function(k,v) {
			Session.set("xCard." + k, v);
		},

		get : function(k) {
			return Session.get("xCard." + k);
		}
	}
}
