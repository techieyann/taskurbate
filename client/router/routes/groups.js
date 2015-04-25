Router.map(function () {
	this.route('solo', {
		path: '/solo',
		controller: 'DefaultSubscriptions',
		data: function () {
			var returnData = {};
			var foundTags = Tags.find({group:'default'}, {sort: {tasks: -1, name:1}});
			returnData.anyTasks = Tasks.find({group:'default'}).count();
			if (returnData.anyTasks) {
				var furthestDue = Tasks.findOne({group:'default', dueNext: {$ne: null}}, {sort: {dueNext: -1}});

				if (furthestDue) returnData.longestTimeDiff = furthestDue.dueNext - Session.get('now');
			}
			var tasksByTag = {
				default: Tasks.find({group: 'default', tag: 'default'}, {sort: {name: 1}})
			};

			if (foundTags.count()) {
				returnData.tags =  foundTags;
				foundTags.forEach(function (tag) {
					tasksByTag[tag._id] = Tasks.find({group: 'default', tag: tag._id}, {sort: {name: 1}});
				});
			}
			returnData.tasksByTag = tasksByTag;
			returnData.selectedGroup = {
				_id: 'default',
				name: 'Self'
			};
			returnData.groups = Groups.find();


			return returnData;
		}

	});
	this.route('groupMember', {
		path: '/groups/:groupId/member/:userId',
		controller: 'DefaultSubscriptions',
		data: function () {
			var returnData = {};
			var group = Groups.findOne({_id: this.params.groupId})
			if (group) {
				returnData.groupId = this.params.groupId;
				returnData.groupName = group.name;
				var userName = group.members[this.params.userId];
				if (userName) returnData.userName = userName;
				else this.redirect('/groups/'+this.params.groupId);
				returnData.groups = groups.find();
				return returnData;
			}
			this.redirect('/groups/');
		}
	});
	this.route('group', {
		path: '/groups/:_id',
		controller: 'DefaultSubscriptions',
		data: function () {
			var returnData = {};
			var group = Groups.findOne({_id: this.params._id});
			if (group) {
				returnData.group = group;
				var foundTags = Tags.find({group: group._id}, {sort: {name:1}});
				returnData.anyTasks = Tasks.find({group:group._id}).count();
				if (returnData.anyTasks) {
					var furthestDue = Tasks.findOne({group:group._id, dueNext: {$ne: null}}, {sort: {dueNext: -1}});

					if (furthestDue) returnData.longestTimeDiff = furthestDue.dueNext - Session.get('now');
				}
				var tasksByTag = {
				default: Tasks.find({group: group._id, tag: 'default'}, {sort: {name: 1}})
				};

				if (foundTags.count()) {
					returnData.tags =  foundTags;
					foundTags.forEach(function (tag) {
						tasksByTag[tag._id] = Tasks.find({group: group._id, tag: tag._id}, {sort: {name: 1}});
					});
				}
				returnData.tasksByTag = tasksByTag;
				returnData.selectedGroup = {
					_id: group._id,
					name: group.name
				};
				returnData.groups = Groups.find();
				return returnData;
			} else this.redirect('/groups');
			
		}
	});
	this.route('groups', {
		path: '/groups',
		controller: 'LoggedInController',
		subscriptions: function () {
		var groups = [];

		if (Meteor.user()) {
			groups = Meteor.user().profile.groups;
		}
			this.wait(Meteor.subscribe('groups', groups));
			if (this.ready()) {
				this.render();
			}

			this.render('loading');			
		},
		data: function () {

			var returnData = {
				groups: Groups.find()
			};

			return returnData;
		}
	});
});
