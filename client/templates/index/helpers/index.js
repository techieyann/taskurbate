Template.index.helpers({
	needsWelcoming: function () {
		return !(this.tags && this.tasks && this.groups && this.anyDue);
	},
	anyDue: function () {
		return this.anyDue;
	}
});
