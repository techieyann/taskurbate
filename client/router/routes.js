Router.map(function () {
	this.route('index', {
		path: '/',
		controller: LoggedInController,
		data: function () {
			if (Meteor.user()) {
				var foundTags = Tags.find({}, {sort: {name:1}});
				return {tags: foundTags};
			}
			return {};
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
		controller: LoggedInController,
		data: function () {
			if (Meteor.user()) {
				var foundTags = Tags.find({}, {sort: {name:1}});
				if (foundTags.count()) return {tags: foundTags};
			}
			return {};
		}
	});
});
