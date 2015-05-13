Template.layout.events({
	'click .add-group': function () {
		openModal('addGroupModalBody', '', false, null);		
	},
	'click .logout': function () {
		Meteor.logout();
	},
	'click .close-modal': function () {
		closeModal();
	},
	'click .complete-task': function () {
		openModal('completeTaskModalBody', 'completeTaskModalFooter', true, this);
	},

	'click .backdate-task': function () {
		openModal('backdateTaskModalBody','backdateTaskModalFooter', true, this);
	}
});


Template.registerHelper('nicknameSet', function () {
	return Meteor.user().profile.nickname;
});

Template.registerHelper('dueNextFormatted', function () {
	return this.dueNext.toLocaleDateString();
});

Template.registerHelper('completedToday', function () {
	if (this.lastCompleted) {
		if (this.lastCompleted.toLocaleDateString() == today()) return true;
	}
	return false;
});

Template.registerHelper('tasksViewIcon', function () {
	var view = Session.get('tasksView');
	if (view == 'list') return 'mdi-action-assignment';
	if (view == 'calendar') return 'mdi-action-event';
});

Template.registerHelper('tagById', function () {
	var tagID = this.tag;
	if (tagID) {
		if (tagID == 'default')	return 'Misc.';
		var tag = Tags.findOne({_id: tagID});
		if (tag) return tag.name;
	}
});

Template.registerHelper('groupById', function () {
	var groupID = this.group;
	if (groupID) {
		if (groupID == 'default') return 'Self';
		var group = Groups.findOne({_id: groupID});
		if (group) return group.name;
	}
});
