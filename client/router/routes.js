Router.map(function () {
	this.route('index', {
		path: '/',
		controller: DefaultSubscriptions,
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
	this.route('solo', {
		path: '/solo',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};
			var foundTags = Tags.find({group:'default'}, {sort: {tasks: -1, name:1}});
			returnData.anyTasks = Tasks.find({group:'default'}).count();
			if (returnData.anyTasks) {
				var furthestDue = Tasks.findOne({group:'default', dueNext: {$ne: null}}, {sort: {dueNext: -1}});

				if (furthestDue.dueNext) returnData.longestTimeDiff = furthestDue.dueNext - Session.get('now');
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
		controller: DefaultSubscriptions,
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
		controller: DefaultSubscriptions,
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
		controller: LoggedInController,
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
	this.route('about', {
		path: '/about'
	});
	this.route('task', {
		path: '/tasks/:_id',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};
			var task = Tasks.findOne({_id: this.params._id});
			if (task) {
				returnData.task = task;
				var foundTags = Tags.find({group: task.group}, {sort: {name:1}}).fetch();
				returnData.tags = foundTags;
				returnData.groups = Groups.find();
				return returnData;
			}
			this.redirect('/tasks');
		}
	});
	this.route('tasks', {
		path: '/tasks',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};

			var taskFilters = Session.get('taskFilters');
			var filters = {$and: [
				{
					group: {$nin: []},
					tag: {$nin: []}
				},
				{
					dueNext: {$ne: null}
				}
			]};
			for (var groupId in taskFilters) {
				if (taskFilters[groupId].group == 'view') {
					for (var tagId in taskFilters[groupId].tags) {
						if (taskFilters[groupId].tags[tagId] == 'hide') {
							if (tagId == 'default') {
								var groupTagFilter = {$or:[{
									group: {$ne:groupId}},
									{tag: {$ne: tagId}
								}]};
								filters.$and.push(groupTagFilter);
							}
							else {
								filters.$and[0].tag.$nin.push(tagId);
							}
						}
					}
				} else {
					filters.$and[0].group.$nin.push(groupId);
				}
			}
			var dueTasks = Tasks.find(filters, {sort: {dueNext:1}}).fetch();
			filters.$and[1].dueNext = null;
			var unDueTasks = Tasks.find(filters, {sort:{name:1}}).fetch();
			returnData.tasks = dueTasks.concat(unDueTasks);
			returnData.anyTasks = Tasks.find().count();
			if (returnData.anyTasks) {
				var furthestDue = Tasks.findOne({dueNext: {$ne: null}}, {sort: {dueNext: -1}});
				if (furthestDue) {
					returnData.anyDue = true;
					returnData.longestTimeDiff = furthestDue.dueNext - Session.get('now');
				}
			}
			if (Meteor.user()) {
				var foundGroups = Groups.find().fetch();
				returnData.groups = foundGroups;
				var foundTags = {
					default: Tags.find({group: 'default'}, {sort: {name:1}}).fetch()
				};
				foundGroups.forEach(function (group) {
					var tags = Tags.find({group: group._id}, {sort: {name:1}}).fetch();
					foundTags[group._id] = tags;
				});
				returnData.tags = foundTags;
			}
			return returnData;
		}		
	});
});
