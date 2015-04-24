Meteor.startup(function () {
	$('body').addClass('grey lighten-4');
	Session.set('now', new Date());
	Meteor.setInterval(function () {
		Session.set('now', new Date());
	}, 60000);
	Session.set('taskFilters', null);
	Session.setDefault('lastCompletedRemoved', '');
	Session.setDefault('selectedCompletedTask', null);
	Session.setDefault('selectedGroup', 'default');
	if (Meteor.user()) {
		Session.setDefault('uid', Meteor.user()._id);
	}
	Session.setDefault('calendar-view-completed-tasks', false);
	Session.setDefault('calendar-view-overdue-tasks', true);
	Session.setDefault('calendar-view-due-tasks', true);
	Session.setDefault('calendar-view', 'basicWeek');
	$(document).ready(function () {

	});
});
