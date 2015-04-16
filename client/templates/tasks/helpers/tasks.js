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
	tagByID: function () {
		var tagID = this.tag;
		if (tagID == 0) {
			return 'Misc.';
		}
		else {
			return Tags.findOne({_id: tagID}).name;
		}
	}
});

Template.taskCollectionElement.events({
	'click .expand': function () {
		var taskID = this._id;
		$('#'+taskID+'-modify').slideDown(300);
		$('#'+taskID+'-expand').hide();
		$('#'+taskID+'-shrink').slideDown(300);
	},
	'click .shrink': function () {
		var taskID = this._id;
		$('#'+taskID+'-modify').slideUp(300);
		$('#'+taskID+'-shrink').hide();
		$('#'+taskID+'-expand').slideDown(300);
	},
	'click .task-description': function () {
		openModal('taskMetaModalBody','taskMetaModalFooter', true, this);
	},
	'click .edit-task': function () {
		openModal('editTaskModalBody','editTaskModalFooter', true, this);
	},
	'click .delete-task': function () {
		openModal('deleteTaskModalBody','deleteTaskModalFooter', false, this);
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
