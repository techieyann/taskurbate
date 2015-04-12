Router.map(function () {
	this.route('index', {
		path: '/',
		subscriptions: function () {
			if (Meteor.user()) {
				this.wait(Meteor.subscribe('tags', Meteor.user()._id));
			}
			this.render('loading');
		},
		data: function () {
			if (Meteor.user()) {
				return Tags.find({}, {sort: {name:1}}).fetch();
			}
		}
	});
	this.route('about', {
		path: '/about'
	});
	this.route('groups', {
		path: '/groups'
	});
	this.route('tasks', {
		path: '/tasks'
	});
	this.route('tags', {
		path: '/tags',
		subscriptions: function () {
			if (Meteor.user()) {
				this.wait(Meteor.subscribe('tags', Meteor.user()._id));
			}
			this.render('loading');
		},
		data: function () {
			if (Meteor.user()) return Tags.find({}, {sort: {name:1}});
		}
	});
});
