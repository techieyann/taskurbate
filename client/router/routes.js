Router.map(function () {
	this.route('index', {
		path: '/',
		controller: DefaultSubscriptions,
		data: function () {

				var foundTags = Tags.find({}, {sort: {name:1}});
				return {tags: foundTags};

			return {};
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

			var foundTags = Tags.find({}, {sort: {name:1}});
			if (foundTags.count()) returnData.tags =  foundTags;
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
			return Tasks.findOne({_id: this.params._id});
		}
	});
	this.route('tasks', {
		path: '/tasks',
		controller: DefaultSubscriptions,
		data: function () {
			var returnData = {};

				var foundTasks = Tasks.find({}, {sort: {dueNext:1}});
				if (foundTasks.count())	returnData.tasks = foundTasks;
				var foundTags = Tags.find({}, {sort: {name:1}});
				returnData.tags = foundTags;

			return returnData;
		}		
	});
});
