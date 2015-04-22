Template.task.onRendered(function () {
	Session.set('selectedCompletedTask', null);
	$('.tooltipped').tooltip({delay:50});

});

Template.task.helpers({
	tagById: function () {
		var tagID = this.tag;
		if (tagID == 0) {
			return 'Misc.';
		}
		else {
			return Tags.findOne({_id: tagID}).name;
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
		openModal('completedCalendarModalBody', 'completedCalendarModalFooter', true, this);
	},
	'click .edit-task': function () {
		openModal('editTaskModalBody','editTaskModalFooter', true, this);
	},
	'click .delete-task': function () {
		openModal('deleteTaskModalBody','deleteTaskModalFooter', false, this);
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
