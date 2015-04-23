Template.index.helpers({
	needsWelcoming: function () {
		return !(this.tags && this.tasks && this.groups);
	},
	anyDue: function () {
		return this.anyDue;
	}
});
