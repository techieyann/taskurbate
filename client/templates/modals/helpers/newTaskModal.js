Template.newTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
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
	if (Tasks.findOne({name: parsedData.taskName})) {
		Materialize.toast('Task named "'+parsedData.taskName+'" already exists...', 4000);
		$('#name').val('').focus();
		return;
	}
	parsedData.taskDuration = parseInt(parsedData.taskDuration, 10);
	if (parsedData.taskDuration == NaN) {
		Materialize.toast('Task duration must be a number', 4000);
		$('#duration').val('').focus();
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
	var now = new Date();
	var options = {
		user: Meteor.user()._id,
		name: parsedData.taskName,
		duration: parsedData.taskDuration,
		tag: parsedData.taskTag,
		schedule: parsedData.taskScheduleType,
		lastCompleted: null,
		description: parsedData.taskDescription,
		created: now
	};
	if (parsedData.taskScheduleType != "adaptive") {
		options.dueEvery = parsedData.taskDaysBeforeDue;
	}
	if (parsedData.taskScheduleType == "strict") {
		options.dueNext = new Date(parsedData.taskDueStarting);
	}
	Meteor.call('newTask', options, function (err) {
		if (err) {
			Materialize.toast('New Task Error: '+err, 4000);
		}
	});
	Materialize.toast('Created task: "'+options.name+'"', 4000);
	closeModal();
};
