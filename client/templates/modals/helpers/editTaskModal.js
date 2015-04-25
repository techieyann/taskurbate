Template.editTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
	var scheduleType = this.data.task.schedule;
	if (scheduleType == "adaptive") {
		$('#lenient-explanation, #strict-explanation, #due-every, #starting-on').hide();
	}
	else if (scheduleType == "lenient") {
		$('#adaptive-explanation, #strict-explanation, #starting-on').hide();
	}
	else if (scheduleType == "strict") {
		$('#adaptive-explanation, #lenient-explanation').hide();
	}
});

Template.editTaskModalBody.helpers({
	groupName: function () {
		var groupId = this.group;
		if (groupId == 'default') return 'Self';
		var group = Groups.findOne({_id: groupId});
		if (group) return group.name;
	},
	disabledWithoutTags: function () {
		if (this.tags){
			if (this.tags.length)	return;
		}
		return 'disabled';
	},
	selectedTag: function (tagId) {
		if (tagId == 'default') {
			if (this.tag == tagId) return 'selected';
		}
		else {
			if (Template.parentData().task.tag == tagId) return 'selected';
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
	dueNextFormatted: function () {
		if (this.dueNext) return this.dueNext.toLocaleDateString();
	},
	tag: function () {
		return this.tags;
	}
});

Template.editTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-explanation, #lenient-explanation').slideUp(300);
		$('#strict-explanation, #starting-on, #due-every').slideDown(300);
	},
	'click #lenient': function () {
		$('#adaptive-explanation, #strict-explanation, #starting-on').slideUp(300);
		$('#lenient-explanation, #due-every').slideDown(300);
	},
	'click #adaptive': function () {
		$('#lenient-explanation, #strict-explanation, #due-every, #starting-on').slideUp(300);
		$('#adaptive-explanation').slideDown(300);
	},
	'submit .edit-task-form': function (e) {
		e.preventDefault();
		processEditTaskForm(this.task._id);
	}
});
Template.editTaskModalFooter.events({
	'click .edit-task': function () {
		processEditTaskForm(this.task._id);
	}
});


var processEditTaskForm = function (taskId) {

	var formData = $('.edit-task-form').serializeArray();
	var parsedData = parseFormData(formData);
	if (parsedData.taskName == "") {
		Materialize.toast('Task name required', 4000);
		$('#name').focus();
		return;
	}
	if (Tasks.findOne({_id: {$ne: taskId}, name: parsedData.taskName})) {
		Materialize.toast('Task named "'+parsedData.taskName+'" already exists...', 4000);
		$('#name').val('').focus();
		return;
	}
	parsedData.taskDuration = parseInt(parsedData.taskDuration, 10);
	if (!parsedData.taskDuration) {
		Materialize.toast('Task duration must be a positive number', 4000);
		$('#duration').val('').focus();
		return;
	}
	if (parsedData.taskDuration <= 0) {
		Materialize.toast('Task duration must be positive', 4000);
		$('#duration').val('').focus();
		return;		
	}
	if (parsedData.taskScheduleType != "adaptive") {
		if (parsedData.taskDaysBeforeDue == "") {
			Materialize.toast('Number of days before due required for strict scheduling', 4000);
			$('#days-before-due').focus();
			return;
		}
		if (parsedData.taskScheduleType == "strict") {
			if (parsedData.taskDueStarting == "") {
				Materialize.toast('Starting due date required for strict scheduling', 4000);
				$('#due-starting').focus();
				return;
			}
		}
	}
	var taskTag = parsedData.taskTag;
	if (!taskTag) taskTag = 'default';
	var now = new Date();
	var options = {
		id: taskId,
		task: {
			name: parsedData.taskName,
			duration: parsedData.taskDuration,
			tag: parsedData.taskTag,
			schedule: parsedData.taskScheduleType,
			description: parsedData.taskDescription,
			edited: now
		}
	};
	if (parsedData.taskScheduleType != "adaptive") {
		options.task.dueNext = new Date(parsedData.taskDueStarting);
		if (parsedData.taskScheduleType == "strict") {
			options.task.dueEvery = parsedData.taskDaysBeforeDue;
		}
	}
	Meteor.call('editTask', options, function (err) {
		if (err) {
			Materialize.toast('Edit Task Error: '+err, 4000);
		}
	});
	Materialize.toast('Edited task: "'+options.task.name+'"', 4000);
	closeModal();
};
