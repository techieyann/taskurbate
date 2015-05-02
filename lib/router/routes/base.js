Router.map(function () {
	this.route('index', {
		path: '/',
		controller: 'LoggedInController',
		data: function () {
			if (Meteor.user()) {
				var now = Session.get('now');
				var forward24Hours = new Date(now.getTime() + (24*60*60*1000));
				var tomorrow = new Date(forward24Hours.toLocaleDateString());
				var notifications = [];
				var groups = Meteor.user().profile.groups;
				groups.forEach( function (group) {
					var foundGroup = Groups.findOne({_id: group});
					if (foundGroup) {
						var memberNotifications = [];
						var members = foundGroup.members;
						for (var id in members) {
							if (id != Meteor.user()._id) {
								var foundMemberNotifications = Notifications.find({$and: [{'data.group.id': group}, {'data.user.id': id}]}).fetch();

								if (foundMemberNotifications.length) {
									memberNotifications.push({
										id: id,
										groupId: group,
										name: members[id],
										memberNotification: foundMemberNotifications
									});
								}
							}
						}
						if (memberNotifications.length) {
							notifications.push({
								id: group,
								name: foundGroup.name,
								byMember: memberNotifications
							});
						}
					}
				});


				var returnData = {
					tags: Tags.find({group: 'default'}).count(),
					tasks: Tasks.find().count(),
					groups: Groups.find().fetch(),
					overdueTasks: Tasks.find({dueNext: {$lt: now}}).fetch(),
					dueTodayTasks: Tasks.find({$and: [{dueNext: {$gt: now}},{dueNext: {$lt: tomorrow}}]}).fetch(),
					notifications: notifications
				};
				var furthestDue = Tasks.findOne({dueNext: {$ne: null}}, {sort: {dueNext: -1}});
				if (furthestDue) {
					returnData.anyDue = true;
					returnData.longestTimeDiff = furthestDue.dueNext - now;
				}
				return returnData;
			}
		},
		fastrender: false
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

