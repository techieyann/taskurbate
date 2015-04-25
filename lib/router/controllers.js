LoggedInController = RouteController.extend({
	onBeforeAction: function() {
		if (!Meteor.user() && this.ready()) {
			return this.redirect('/login');
		} else this.next();
	},
	fastrender:true
});


DefaultSubscriptions = LoggedInController.extend({
	subscriptions: function () {
		var userId = '';
		var groups = [];

		if (Meteor.user()) {
			userId = Meteor.user()._id;
			groups = Meteor.user().profile.groups;
		}
		this.wait(Meteor.subscribe('notifications', userId));
		this.wait(Meteor.subscribe('groups', groups));
		this.wait(Meteor.subscribe('tasks', userId, groups));
		this.wait(Meteor.subscribe('tags', userId, groups));
		this.wait(Meteor.subscribe('completed', userId, groups));
		if (this.ready()) {
			this.render();
		}

		this.render('loading');
	}
});
