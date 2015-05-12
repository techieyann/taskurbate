Template.solo.helpers({
	calendarViewAvailable: function () {
		return (Meteor.Device.isDesktop() && Completed.find({group: {$exists: false}}).count());
	},
	calendarOptions: function () {
		var groupId = 'default';
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
				var completedEvents = completedTasks(groupId);
				if (completedEvents.length) {
					taskArray.push.apply(taskArray, completedEvents);
				}
				callback(taskArray);
			},
			eventClick: function (calEvent, jsEvent, view) {
				Router.go('/tasks/'+calEvent.id);
			}
		};
		return calOptions;
	}
});

Template.solo.events({
	'click #hide-tasks': function () {
		$('#hide-tasks').hide();
		$('#show-tasks').show();
		$('#solo-tasks').slideUp(300);
	},
	'click #show-tasks': function () {
		$('#show-tasks').hide();
		$('#hide-tasks').show();
		$('#solo-tasks').slideDown(300);
	}
});
