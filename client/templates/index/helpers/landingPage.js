Template.welcomeMessage.helpers({
	anyTags: function () {
		return this.tags;
	},
	anyTasks: function () {
		return this.tasks;
	},
	tasksButNoneDue: function () {
		return (this.tasks && !this.anyDue);
	},
	anyGroups: function () {
		return this.groups;
	}


});
