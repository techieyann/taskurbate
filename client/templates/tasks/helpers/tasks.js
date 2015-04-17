Template.tasks.helpers({
	anyTasks: function () {
		return (this.tasks ? true: false);
	},
	task: function () {
		return this.tasks;
	}
});

Template.taskCollectionElement.onRendered(function () {
	$('.tooltipped').tooltip({delay:50});
});

Template.taskCollectionElement.helpers({
	completedToday: function () {
		if (this.lastCompleted) {
			if (this.lastCompleted.toLocaleDateString() == today()) return true;
		}
		return false;
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
		var options = {
			user: Meteor.user()._id,
			task: this._id,
			at: new Date()
		};
		Meteor.call('completeTask', options, function (err) {
			if (err) Materialize.toast('Complete task error: '+err);
		});
		Materialize.toast('Completed task: "'+this.name+'"', 4000);
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

deleteTask = function (id, name) {
	Meteor.call('deleteTask', id, function (err) {
		if (err) {
			Materialize.toast('Error: '+err, 5000);
		}
	});
	closeModal();
	Materialize.toast('Deleted task: "'+name+'"', 3000);
};
