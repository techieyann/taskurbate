Template.newTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
	$('#strict-inputs').hide();
});

Template.newTaskModalBody.helpers({
	disabledWithoutTags: function () {
		if (!this.tags.length) return 'disabled';
	},
	tag: function () {
		return Tags.find();
	}
});
Template.newTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-scheduling-explanation').slideUp(300);
		$('#strict-inputs').slideDown(300);
	},
	'click #adaptive': function () {
		$('#strict-inputs').slideUp(300);
		$('#adaptive-scheduling-explanation').slideDown(300);
	},
	'submit .new-task-form': function (e) {
		e.preventDefault();
		processNewTaskForm();
	}
});
Template.newTaskModalFooter.events({
	'click .create-task': function () {
		processNewTaskForm();
	}
});

var processNewTaskForm = function () {
	var formData = $('.new-task-form').serializeArray();
	var parsedData = parseFormData(formData);
	if (parsedData.taskName == "") {
		Materialize.toast('Task name required', 4000);
		$('#name').focus();
		return;
	}
	if (Tasks.findOne({user: Meteor.user()._id, name: parsedData.taskName})) {
		Materialize.toast('Task named "'+parsedData.taskName+'" already exists...', 4000);
		$('#name').val('').focus();
		return;
	}
	if (parsedData.taskScheduleType == "strict") {
		if (parsedData.taskDaysBeforeDue == "") {
			Materialize.toast('Number of days before due required for strict scheduling', 4000);
			$('#days-before-due').focus();
			return;
		}
		if (parsedData.taskDueStarting == "") {
			Materialize.toast('Starting due date required for strict scheduling', 4000);
			$('#due-starting').focus();
			return;
		}
	}
	var options = {
		user: Meteor.user()._id,
		name: parsedData.taskName,
		tag: parsedData.taskTag,
		schedule: parsedData.taskScheduleType,
		dueNext: parsedData.taskDueStarting,
		dueEvery: parsedData.taskDaysBeforeDue,
		description: parsedData.taskDescription
	};
	options.user = Meteor.user()._id;
	Meteor.call('newTask', options, function (err) {
		if (err) {
			Materialize.toast('New Task Error: '+err, 4000);
		}
	});
	Materialize.toast('Created task: "'+options.name+'"', 4000);
	closeModal();
};
