Router.map(function () {
	this.route('index', {
		path: '/',
		controller: DefaultSubscriptions,
		data: function () {
			if (Meteor.user()) {
				var foundTags = Tags.find({}, {sort: {name:1}});
				return {tags: foundTags};
			}
			return {};
		}
	});
	this.route('login', {
		path: '/login'
	});
	this.route('settings', {
		path: '/settings',
		controller: LoggedInController,
		subscriptions: function () {
			this.wait(Meteor.subscribe('groups'));
			if (this.ready()) {
				this.render();
			}

			this.render('loading');
		},
	});
	this.route('about', {
		path: '/about'
	});
	this.route('groups', {
		path: '/groups',
		controller: LoggedInController,
		subscriptions: function () {
			this.wait(Meteor.subscribe('groups'));
			if (this.ready()) {
				this.render();
			}

			this.render('loading');
		}
	});
	this.route('tasks', {
		path: '/tasks',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};
			if (Meteor.user()) {
				var foundTasks = Tasks.find({}, {sort: {dueNext:1}});
				if (foundTasks.count())	returnData.tasks = foundTasks;
				var foundTags = Tags.find({}, {sort: {name:1}});
				returnData.tags = foundTags;
			}
			return returnData;
		}		
	});
	this.route('tags', {
		path: '/tags',
		controller: DefaultSubscriptions,
		data: function () {
			if (Meteor.user()) {
				var foundTags = Tags.find({}, {sort: {name:1}});
				if (foundTags.count()) return {tags: foundTags};
			}
			return {};
		}
	});
});
