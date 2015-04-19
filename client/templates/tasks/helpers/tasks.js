var longestTimeDiff;

Template.tasks.helpers({
	anyTasks: function () {
		var furthestDue = Tasks.findOne({}, {sort: {dueNext:-1}});
		if (furthestDue) {
			longestTimeDiff = furthestDue.dueNext - Session.get('now');
		}		
		return (this.tasks ? true: false);
	},
	task: function () {
		return this.tasks;
	}
});

Template.taskCollectionElement.helpers({
	completedToday: function () {
		if (this.lastCompleted) {
			if (this.lastCompleted.toLocaleDateString() == today()) return true;
		}
		return false;
	}, 
	dueColor: function () {
		if (this.dueNext) {
			var diff = this.dueNext - Session.get('now');
			if (diff < 0) {
				return 'red';
			}
			if (diff < (longestTimeDiff / 5)) {
				return 'orange';
			}
			if (diff < (longestTimeDiff / 4)) {
				return 'amber';
			}
			if (diff < (longestTimeDiff / 3)) {
				return 'lime';
			}
			if (diff < (longestTimeDiff / 2)) {
				return 'green';
			}
			if (diff < (longestTimeDiff)) {
				return 'teal';
			}
			if (diff == longestTimeDiff) {
				return 'blue';
			}
		} else {
			return 'black';
		}
	}
});

Template.taskCollectionElement.events({
	'click .expand': function () {
		var taskID = this._id;
		$('#'+taskID+'-modify').slideDown(300);
		$('#'+taskID+'-expand').hide();
		$('#'+taskID+'-shrink').slideDown(500);
	},
	'click .shrink': function () {
		var taskID = this._id;
		$('#'+taskID+'-modify').slideUp(300);
		$('#'+taskID+'-shrink').hide();
		$('#'+taskID+'-expand').slideDown(500);
	},
	'click .task-complete': function () {
		completeTask(this._id, this.name);
	},
	'click .task-description': function () {
		openModal('taskMetaModalBody','taskMetaModalFooter', true, this);
	},
	'click .edit-task': function () {
		openModal('editTaskModalBody','editTaskModalFooter', true, this);
	},
	'click .delete-task': function () {
		openModal('deleteTaskModalBody','deleteTaskModalFooter', false, this);
	},
	'click .backdate-task': function () {
		openModal('backdateTaskModalBody','backdateTaskModalFooter', false, this);
	}
});

completeTask = function (id, name) {
	var options = {
		user: Meteor.user()._id,
		task: id,
		at: new Date()
	};
	Meteor.call('completeTask', options, function (err) {
		if (err) Materialize.toast('Complete task error: '+err);
	});
	Materialize.toast('Completed task: "'+name+'"', 4000);
};

deleteTask = function (id, name) {
	Meteor.call('deleteTask', id, function (err) {
		if (err) {
			Materialize.toast('Error: '+err, 5000);
		}
	});
	closeModal();
	Materialize.toast('Deleted task: "'+name+'"', 3000);
};
