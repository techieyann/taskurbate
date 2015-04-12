Tags = new Meteor.Collection('tags');
Tasks = new Meteor.Collection('tasks');

Meteor.methods({
	newTag: function (tag) {
		return Tags.insert(tag);
	},
	editTag: function (options) {
		return Tags.update({_id: options.id}, {$set: {name: options.name}});
	},
	deleteTag: function (tagId) {
		Tasks.update({user: Meteor.user()._id, tag: tagId}, {$set: {tag: 0}});
		return Tags.remove({_id: tagId});
	},
	newTask: function (task) {
		return Tasks.insert(task);
	},
	editTask: function (options) {
		return Tasks.update({_id: options.id}, {$set: options.task});
	},
	deleteTask: function (taskId) {
		return Tasks.remove({_id: taskId});
	}
});
