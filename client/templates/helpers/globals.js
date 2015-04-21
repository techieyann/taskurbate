Template.layout.events = {
	'click .logout': function () {
		Meteor.logout();
	},
	'click .close-modal': function () {
		closeModal();
	},
	'click .complete-task': function () {
		completeTask(this._id, this.name);
		closeModal();
	},

	'click .backdate-task': function () {
		openModal('backdateTaskModalBody','backdateTaskModalFooter', false, this);
	}
};

Template.registerHelper('dueNextFormatted', function () {
	return this.dueNext.toLocaleDateString();
});

Template.registerHelper('completedToday', function () {
	if (this.lastCompleted) {
		if (this.lastCompleted.toLocaleDateString() == today()) return true;
	}
	return false;
});
