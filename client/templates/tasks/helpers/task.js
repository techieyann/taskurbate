Template.task.onRendered(function () {
	Session.set('selectedCompletedTask', null);
	$('.tooltipped').tooltip({delay:50});

});

Template.task.helpers({
	tagById: function () {
		var tagID = this.tag;
		if (tagID == 'default') {
			return 'Misc.';
		}
		else {
			return Tags.findOne({_id: tagID}).name;
		}
	},
	groupById: function () {
		var groupID = this.group;
		if (groupID == 'default') {
			return 'Self';
		}
		else {
			return Groups.findOne({_id: groupID}).name;
		}
	},
	dueData: function () {
		if (this.dueNext && this.dueEvery) return true;
		return false;
	},
	dueEveryFormatted: function () {
		return Math.round(this.dueEvery*100)/100;
	},
	daysPlural: function () {
		if (this.dueEvery != 1) return 's';
	}
});

Template.task.events({
	'click .completed-calendar': function () {
		openModal('completedCalendarModalBody', 'completedCalendarModalFooter', true, this.task);
	},
	'click .graph-task': function () {
		openModal('graphTaskModalBody', 'graphTaskModalFooter', false, this.task);
	},
	'click .edit-task': function () {
		openModal('editTaskModalBody','editTaskModalFooter', true, this);
	},
	'click .delete-task': function () {
		openModal('deleteTaskModalBody','deleteTaskModalFooter', false, this.task);
	},
	'click .show-calendar': function () {
		$('.hide-calendar').show();
		$('.show-calendar').hide();
		$('#task-calendar').slideDown(500);

	},
	'click .hide-calendar': function () {
		$('.show-calendar').show();
		$('.hide-calendar').hide();
		$('#task-calendar').slideUp(500);
	}
});
