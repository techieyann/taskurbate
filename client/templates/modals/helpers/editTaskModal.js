Template.editTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
	var scheduleType = this.data.schedule;
	if (scheduleType == "adaptive") {
		$('#hybrid-explanation, #strict-explanation, #due-every, #starting-on').hide();
	}
	else if (scheduleType == "hybrid") {
		$('#adaptive-explanation, #strict-explanation, #starting-on').hide();
	}
	else if (scheduleType == "strict") {
		$('#adaptive-explanation, #hybrid-explanation').hide();
	}
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
	dueNextFormatted: function () {
		return this.dueNext.toLocaleDateString();
	},
	tag: function () {
		return Tags.find();
	}
});

Template.editTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-explanation, #hybrid-explanation').slideUp(300);
		$('#strict-explanation, #starting-on, #due-every').slideDown(300);
	},
	'click #hybrid': function () {
		$('#adaptive-explanation, #strict-explanation, #starting-on').slideUp(300);
		$('#hybrid-explanation, #due-every').slideDown(300);
	},
	'click #adaptive': function () {
		$('#hybrid-explanation, #strict-explanation, #due-every, #starting-on').slideUp(300);
		$('#adaptive-explanation').slideDown(300);
	},
	'submit .edit-task-form': function (e) {
		e.preventDefault();
		processEditTaskForm(this._id);
	}
});
Template.editTaskModalFooter.events({
	'click .edit-task': function () {
		processEditTaskForm(this._id);
	}
});


var processEditTaskForm = function (taskId) {
	console.log(taskId);
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
	var options = {
		id: taskId,
		task: {
			name: parsedData.taskName,
			tag: parsedData.taskTag,
			schedule: parsedData.taskScheduleType,
			description: parsedData.taskDescription
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
