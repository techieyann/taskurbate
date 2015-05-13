Template.task.onRendered(function () {
	Session.set('selectedCompletedTask', null);
	$('.tooltipped').tooltip({delay:50});

});

Template.task.helpers({
	soloGroup: function () {
		return (this.group == 'default');
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
		var data = {
			task: this.task,
			tags: this.tags
		};
		openModal('editTaskModalBody','editTaskModalFooter', true, data);
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
