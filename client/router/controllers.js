LoggedInController = RouteController.extend({
	subscriptions: function () {
		var userId = '';
		if (Meteor.user()) userId = Meteor.user()._id;
		this.wait(Meteor.subscribe('tasks', userId));
		this.wait(Meteor.subscribe('tags', userId));
		this.wait(Meteor.subscribe('completed', userId));
		if (this.ready()) {
			this.render();
		}

		this.render('loading');
	},
	onBeforeAction: function() {
		if (!Meteor.user() && this.ready()) {
			return this.redirect('/login');
		} else this.next();
	}
}); 
