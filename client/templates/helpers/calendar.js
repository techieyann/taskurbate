Template.calendar.helpers({
	calendarOptions: function () {

		var calOptions = {
			id: 'calendar',
			header: {
				left: 'prev',
				center: 'month,agendaWeek,agendaDay today',
				right: 'next'
			},
			defaultView: 'basicWeek',
			events: function (start, end, timezone, callback) {
				var taskArray = [];
				if (Session.get('calendar-view-completed-tasks')) {
					var completedEvents = completedTasks();
					if (completedEvents.length) {
						taskArray.push.apply(taskArray, completedEvents);
					}
				}
				if (Session.get('calendar-view-due-tasks')) {
					var dueEvents = scheduledTasks();
					if (dueEvents.length) {
						taskArray.push.apply(taskArray, dueEvents);
					}
				}
				callback(taskArray);
			}
		};
		console.log(calOptions);
		return calOptions;
	}
});


var completedTasks = function () {
	var completed = Completed.find({}, {fields: {task: 1, at: 1}});
	var taskArray = [];
	var taskNames = {};
	completed.forEach(function (done) {
		var taskName = taskNames[done.task];
		if (!taskName) {
			taskName = Tasks.findOne({_id: done.task});
			if (taskName)	{
				taskName = taskName.name;
				taskNames[done.task] = taskName;

			} else taskName = '';
		}
		var calendarObject = {
			title: taskName,
			start: done.at
		};
		taskArray.push(calendarObject);
	});
	return taskArray;
};

var taskArray = [];
var longestTimeDiff = 0;
var now;

var scheduledTasks = function () {
	now = new Date();
	taskArray = [];
	var scheduled = Tasks.find({dueNext: {$ne: null}}, {sort: {dueNext: -1}}).fetch();
	if (scheduled.length) {
		longestTimeDiff = scheduled[0].dueNext - now;
		scheduled.forEach(function (task) {processTaskIntoEvent(task);});
	}
	return taskArray;
};

var processTaskIntoEvent = function (task) {
	var calendarObject = {
		title: task.name,
		start: task.dueNext
	};
	var timeDiff = task.dueNext - now;
	
	if (timeDiff < 0) {
		calendarObject.color = colors.red;
		calendarObject.borderColor = colors.redBorder;
		calendarObject.textColor = 'white';
	}	else if (timeDiff < (longestTimeDiff / 5)) {
		calendarObject.color = colors.orange;
		calendarObject.borderColor = colors.orangeBorder;
		calendarObject.textColor = 'white';
	}	else if (timeDiff < (longestTimeDiff / 4)) {
		calendarObject.color = colors.amber;
		calendarObject.borderColor = colors.amberBorder;
	} else if (timeDiff < (longestTimeDiff / 3)) {
		calendarObject.color = colors.lime;
		calendarObject.borderColor = colors.limeBorder;
	} else if (timeDiff < (longestTimeDiff / 2)) {
		calendarObject.color = colors.lime;
		calendarObject.borderColor = colors.limeBorder;
	} else if (timeDiff < (longestTimeDiff / 1.25)) {
		calendarObject.color = colors.green;
		calendarObject.borderColor = colors.greenBorder;
		calendarObject.textColor = 'black';	
	}	else {
		calendarObject.color = colors.teal;
		calendarObject.borderColor = colors.tealBorder;
		calendarObject.textColor = 'black';	
	}
	if (task.dueNext.toLocaleTimeString() == '12:00:00 AM') {
		calendarObject.allDay = true;
	}
	taskArray.push(calendarObject);

};

var colors = {
	teal: '#009688',
	tealBorder: '#00897b',
	green: '#4caf50',
	greenBorder: '#43a047',
	lime: '#cddc39',
	limeBorder: '#c0ca33',
	amber: '#ffc107',
	amberBorder: '#ffb300',
	orange: '#ff9800',
	orangeBorder: '#fb8c00',
	red: '#e53935',
	redBorder: '#d32f2f',
};
