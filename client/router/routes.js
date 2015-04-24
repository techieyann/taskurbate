Router.map(function () {
	this.route('index', {
		path: '/',
		controller: DefaultSubscriptions,
		layoutTemplate: 'containerlessLayout',
		data: function () {
			var returnData = {
				tags: Tags.find({group: 'default'}).count(),
				tasks: Tasks.find().count(),
				groups: Groups.find().count(),
				anyDue: Tasks.find({dueNext: {$ne: null}}).count()
			};
			return returnData;
		}
	});
	this.route('login', {
		path: '/login'
	});
	this.route('settings', {
		path: '/settings',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};
			returnData.tagGroup = 'default';
			var foundTags = Tags.find({group:'default'}, {sort: {name:1}});
			if (foundTags.count()) returnData.tags =  foundTags;

			return returnData;
		}

	});
	this.route('groupMember', {
		path: '/groups/:groupId/member/:userId',
		controller: DefaultSubscriptions,
		data: function () {
			return Groups.findOne({_id: this.params.groupid});
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
				returnData.tasks = Tasks.find({group: group._id}, {sort: {dueNext:1}});
				var foundTags = Tags.find({group: group._id}, {sort: {name:1}});
				if (foundTags.count()) returnData.tags = foundTags;
				returnData.tagGroup = group._id;
				return returnData;
			} else this.redirect('/groups');
			
		}
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
		},
		data: function () {
			var returnData = {};
			if (Meteor.user()) {
				var groupsArray = Meteor.user().profile.groups;
				if (groupsArray) returnData.groups = Groups.find({_id: {$in: groupsArray}});
			}
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
