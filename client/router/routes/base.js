Router.map(function () {
	this.route('index', {
		path: '/',
		controller: 'LoggedInController',
		data: function () {
			var returnData = {
				tags: Tags.find({group: 'default'}).count(),
				tasks: Tasks.find().count(),
				groups: Groups.find().fetch(),
				anyDue: Tasks.find({dueNext: {$ne: null}}).count()
			};
			return returnData;
		}
	});
	this.route('login', {
		path: '/login'
	});
	this.route('about', {
		path: '/about'
	});
});

