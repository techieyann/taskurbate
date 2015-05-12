Template.calendarViewControl.onRendered(function () {
	$('#calendar-view-select').material_select();
});

Template.calendarArrows.events({
	'click #prev-arrow': function () {
		$('#calendar').fullCalendar('prev');
	},
	'click #next-arrow': function () {
		$('#calendar').fullCalendar('next');
	},
	'click #goto-today': function () {
		$('#calendar').fullCalendar('today');
	}
});

Template.calendarViewControl.events({
	'change select': function (e) {
		Session.set('calendar-view', e.target.value);
		$('#calendar').fullCalendar('changeView', e.target.value);
	}
});



Template.calendarViewControl.helpers({
	calendarView: function (view) {
		if (Session.equals('calendar-view', view)) return 'selected';
	}
});

Template.calendar.helpers({
	calendarOptions: function () {

		var calOptions = {
			id: 'calendar',
			header: {
				left: '',
				center: 'title',
				right: ''
			},
			defaultView: Session.get('calendar-view'),
			events: function (start, end, timezone, callback) {
				var taskArray = [];
				var dueEvents = scheduledTasks();
				if (dueEvents.length) {
					taskArray.push.apply(taskArray, dueEvents);
				}
				callback(taskArray);
			},
			eventClick: function (calEvent, jsEvent, view) {
				if(calEvent.type == 'completed') {
					Router.go('/tasks/'+calEvent.id);
				} else if (calEvent.type == 'scheduled') {
					var modalData = {
						_id: calEvent.id,
						duration: calEvent.duration,
						name: calEvent.name
					}
					openModal('completeTaskModalBody', 'completeTaskModalFooter', true, modalData);
				}
			}
		};
		return calOptions;
	}
});

var longestTimeDiff = 0;


var scheduledTasks = function () {
	var now = Session.get('now');
	var taskArray = [];
	var scheduled = Template.parentData().tasks;
	if (scheduled.length) {
		longestTimeDiff = scheduled[0].dueNext - now;
		scheduled.forEach(function (task) {
			if (task.dueNext) {
				var newEvent = processTaskIntoEvent(task);
				taskArray.push(newEvent);
			}
		});
	}
	return taskArray;
};

var processTaskIntoEvent = function (task) {
	var eventTitle = task.duration+'m '+task.name;
	var displayDuration;
	if (task.duration > 20) displayDuration = task.duration;
	else displayDuration = 20;
	var endAt = new Date(task.dueNext.getTime() + (displayDuration*60*1000));
	var longestTimeDiff = Template.parentData().longestTimeDiff;

	var calendarObject = {
		title: eventTitle,
		start: task.dueNext,
		end: endAt,
		id: task._id,
		name: task.name,
		duration: task.duration,
		type: 'scheduled'
	};


	var timeDiff = task.dueNext - Session.get('now');
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
	if (task.schedule == 'strict') {
		calendarObject.allDay = true;
	}
	return calendarObject;
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
