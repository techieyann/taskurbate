Template.index.helpers({
	needsWelcoming: function () {
		var tags = this.tags;
		var completed = Completed.find().count();
		if (tags && completed) return false;
		return true;
	}
});
