Template.selectedTask.helpers({
	taskSelected: function () {
		if (Session.get('selectedTask')) {
			window.location.hash = '#task-highlight';
			return true;
		}
		return false;
	},
	completedToday: function () {
		var task = Session.get('selectedTask');
		if (task) {
			if (task.lastCompleted) {
				if (task.lastCompleted.toLocaleDateString() == today()) return true;
			}
		}
		return false;
	},
	duration: function () {
		var task = Session.get('selectedTask');
		if (task) return task.duration;
	},
	name: function () {
		var task = Session.get('selectedTask');
		if (task) return task.name;
	},
	dueString: function () {
		var task = Session.get('selectedTask');
		if (task) {
			var diff = task.dueNext - Session.get('now');
			var hours = Math.round(diff / (1000 * 60 * 60));
			var pluralHours = ' hour';
			if (hours != 1) pluralHours = ' hours';
			var due = '';
			if (hours < 0) due = '- Due ' + hours + pluralHours+ ' ago';
			else due = '- Due in ' + hours + pluralHours;
			return due;
		}
	}
});

Template.selectedTask.events({
	'click .complete-task': function () {
		var task = Session.get('selectedTask');
		if (task) {
			completeTask(task._id, task.name);
			Session.set('selectedTask', null);
		}
	},
	'click .backdate-task': function () {
		var task = Session.get('selectedTask');
		if (task)	{
			openModal('backdateTaskModalBody','backdateTaskModalFooter', false, task);
			Session.set('selectedTask', null);
		}
	},
	'click .deselect-task': function () {
		Session.set('selectedTask', null);
	},
});
