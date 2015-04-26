Router.map(function () {
	this.route('index', {
		path: '/',
		controller: 'LoggedInController',
		data: function () {
			var now = Session.get('now');
			var forward24Hours = new Date(now.getTime() + (24*60*60*1000));
			var tomorrow = new Date(forward24Hours.toLocaleDateString());


			var returnData = {
				tags: Tags.find({group: 'default'}).count(),
				tasks: Tasks.find().count(),
				groups: Groups.find().fetch(),
				overdueTasks: Tasks.find({dueNext: {$lt: now}}).fetch(),
				dueTodayTasks: Tasks.find({$and: [{dueNext: {$gt: now}},{dueNext: {$lt: tomorrow}}]}).fetch(),
				notifications: Notifications.find().fetch()
			};
			var furthestDue = Tasks.findOne({dueNext: {$ne: null}}, {sort: {dueNext: -1}});
			if (furthestDue) {
				returnData.anyDue = true;
				returnData.longestTimeDiff = furthestDue.dueNext - now;
			}
			return returnData;
		}
	});
	this.route('login', {
		path: '/login',
		onAfterAction: function () {
			if (Meteor.user() && this.ready()) this.redirect('/');
		}
	});
	this.route('about', {
		path: '/about'
	});
});

