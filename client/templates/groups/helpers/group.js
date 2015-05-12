Template.group.helpers({
	groupMember: function () {
		var memberArray = [];
		var members = this.group.members;
		var groupId = Session.get('calendar-group-id');
		for (var key in members) {
			memberArray.push({
				name: members[key],
				id: key,
				groupMemberPath: '/groups/'+groupId+'/member/'+key
			});
		}
		return memberArray;
	},
	memberView: function (member) {
		return (Session.equals('calendar-member-view', member) ? 'selected':'');
	},
	reInitMemberSelect: function () {
		Tracker.afterFlush(function () {
			$('#calendar-member-view-select').material_select();
		});
	},
	calendarViewAvailable: function () {
		return (Meteor.Device.isDesktop() && Completed.find({group: Session.get('calendar-group-id')}).count());
	},
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
				var groupId = Session.get('calendar-group-id');
				var memberView = Session.get('calendar-member-view');
				var userId = null;
				if (memberView != 'everyone') userId = memberView;
				var taskArray = [];
				var completedEvents = completedTasks(groupId, userId);
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

Template.group.events({
	'click #hide-tasks': function () {
		$('#hide-tasks').hide();
		$('#show-tasks').show();
		$('#group-tasks').slideUp(300);
	},
	'click #show-tasks': function () {
		$('#show-tasks').hide();
		$('#hide-tasks').show();
		$('#group-tasks').slideDown(300);
	}, 
	'change select': function (e) {
		Session.set('calendar-member-view', e.target.value);
	}

});
