LoggedInController = RouteController.extend({
	onBeforeAction: function() {
		if (!Meteor.user() && this.ready()) {
			return this.redirect('/login');
		} else this.next();
	}
});


DefaultSubscriptions = LoggedInController.extend({
	subscriptions: function () {
		var groups = [];
		if (Meteor.user()) {
			groups = Meteor.user().profile.groups;
		}
		return [
			Meteor.subscribe('notifications'),
			Meteor.subscribe('groups', groups),
			Meteor.subscribe('tasks', groups),
			Meteor.subscribe('tags', groups),
			Meteor.subscribe('completed', groups)
		];
	}
});
