Template.newTaskModalBody.onRendered(function () {
	$('#group').material_select();
	$('#tag').material_select();
	$('#due-starting').datepicker({minDate:0});
});



Template.newTaskModalBody.helpers({
	disabledWithoutTags: function () {
		var group = Session.get('selectedGroup');
		if (this.tags){
			if (this.tags[group]){
				if (this.tags[group].length) {

					return;
				}
			}
		}
		return 'disabled';
	},
	disabledWithoutGroups: function () {
		if (this.groupSelectDisabled) return 'disabled';
		if (this.groups) {
			if (!this.groups.length) return 'disabled';
		}
	},
	tag: function () {
		var group = Session.get('selectedGroup');
		return this.tags[group];
	},
	group: function () {
		return this.groups;
	},
	selectedGroup: function (group) {
		return (Session.equals('selectedGroup', group) ? 'selected': '');
	}
});
Template.newTaskModalBody.events({
	'change #group': function (e) {
		Session.set('selectedGroup', $(e.target).val());
		Tracker.flush();
	Tracker.afterFlush(function () {
		$('#tag').material_select();
	});
	},
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
	var taskGroup = parsedData.taskGroup;
	if (!taskGroup) taskGroup = Session.get('selectedGroup');
	if (!taskGroup) taskGroup = 'default';
	var now = new Date();
	var options = {
		user: Meteor.user()._id,
		name: parsedData.taskName,
		duration: parsedData.taskDuration,
		group: taskGroup,
		tag: taskTag,
		schedule: parsedData.taskScheduleType,
		lastCompleted: null,
		description: parsedData.taskDescription,
		created: now
	};
	if (parsedData.taskScheduleType != "adaptive") {
		options.dueEvery = parsedData.taskDaysBeforeDue;
	}
	if (parsedData.taskScheduleType == "strict") {
		var due = new Date(parsedData.taskDueStarting);
		options.dueNext = new Date(due.getTime() + (1000 * 60 * 60 * 24) - 1);
	}
	console.log(options);
	Meteor.call('newTask', options, function (err) {
		if (err) {
			Materialize.toast('New Task Error: '+err, 4000);
		}
	});
	Materialize.toast('Created task: "'+options.name+'"', 4000);
	closeModal();
};
