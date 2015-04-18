Meteor.startup(function () {

	$(document).ready(function () {
		Session.setDefault('lastCompletedRemoved', '');
		if (Meteor.user()) {
			Session.setDefault('uid', Meteor.user()._id);
		}
		Session.setDefault('calendar-view-completed-tasks', true);
		Session.setDefault('calendar-view-overdue-tasks', true);
		Session.setDefault('calendar-view-due-tasks', true);
	});
});
