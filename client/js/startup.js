$(document).ready(function () {
	var head = $('head');

  var meta = $('meta');
  head.append(meta.clone());
  meta.remove();
  var title = $('title');
  head.append(title.clone());
  title.remove();

	$('head>style, .spinner').remove();

});
Meteor.startup(function () {
	$('body').addClass('grey lighten-4');
	Session.set('now', new Date());
	Meteor.setInterval(function () {
		Session.set('now', new Date());
	}, 60000);

	Session.set('tasksView', 'list');
	Session.set('tasksPerPage', 10);
	Session.set('tasksPage', 1);
	Session.setDefault('lastCompletedRemoved', '');
	Session.setDefault('selectedCompletedTask', null);
	Session.setDefault('selectedGroup', 'default');
	if (Meteor.user()) {
		Session.setDefault('uid', Meteor.user()._id);
		Session.setDefault('taskFilters', null);
	}
	Session.setDefault('calendar-view', 'month');
	Session.setDefault('calendar-member-view', 'everyone');

});
