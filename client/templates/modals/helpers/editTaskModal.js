Template.editTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
});

Template.editTaskModalBody.helpers({
	selectedTag: function (tagId) {
		if (tagId == 0) {
			if (this.tag == tagId) return 'selected';
		}
		else {
			var tag = Template.parentData().tag;
			if (tag == tagId) return 'selected';
		}
		return '';
	},
	checkedSchedule: function (type) {
		if (this.schedule == type) return 'checked';
		return '';
	},
	scheduleType: function (type) {
		if (this.schedule == type) return '';
		return 'hidden';
	},
	tag: function () {
		return Tags.find();
	}
});

Template.editTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-scheduling-explanation').slideUp(300);
		$('#strict-inputs').slideDown(300);
	},
	'click #adaptive': function () {
		$('#strict-inputs').slideUp(300);
		$('#adaptive-scheduling-explanation').slideDown(300);
	},
	'submit .edit-task-form': function (e) {
		e.preventDefault();
		processEditTaskForm();
	}
});
Template.editTaskModalFooter.events({
	'click .edit-task': function () {
		processEditTaskForm();
	}
});
