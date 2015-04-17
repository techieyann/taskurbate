LoggedInController = RouteController.extend({
	subscriptions: function () {
		if (Meteor.user()) {
			var userId = Meteor.user()._id;
			this.wait(Meteor.subscribe('tasks', userId));
			this.wait(Meteor.subscribe('tags', userId));
			this.wait(Meteor.subscribe('completed', userId));
			if (this.ready()) {
				this.render();
			}
		}
		this.render('loading');
	}
}); 
