Router.map(function () {
	this.route('task', {
		path: '/tasks/:_id',
		controller: 'LoggedInController',
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
		controller: 'LoggedInController',
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