Template.welcome.helpers({
	tasksButNoneDue: function () {
		return (this.tasks && !this.anyDue);
	}
});
