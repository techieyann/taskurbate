LoggedInController = RouteController.extend({
	onBeforeAction: function() {
		if (!Meteor.user()) {
			return this.redirect('/login');
		} else this.next();
	},
	fastrender:true
});


DefaultSubscriptions = LoggedInController.extend({
	waitOn: function () {
		var userId = '';
		var groups = [];

		if (Meteor.user()) {
			userId = Meteor.user()._id;
			groups = Meteor.user().profile.groups;
		}
		return [
			Meteor.subscribe('notifications', userId),
			Meteor.subscribe('groups', groups),
			Meteor.subscribe('tasks', userId, groups),
			Meteor.subscribe('tags', userId, groups),
			Meteor.subscribe('completed', userId, groups)
		];
	}
});
