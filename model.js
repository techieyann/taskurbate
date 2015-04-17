Tags = new Meteor.Collection('tags');
Tasks = new Meteor.Collection('tasks');
Completed = new Meteor.Collection('completed');

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
		var oldSchedule = Tags.findOne({_id: options.id}).schedule;
		Tasks.update({_id: options.id}, {$set: options.task});
		if (oldSchedule != options.task.schedule) {
			updateTaskMeta(options.id);
		}
		return;
	},
	deleteTask: function (taskId) {
		return Tasks.remove({_id: taskId});
	},
	completeTask: function (options) {
		Completed.insert(options);
		updateTaskMeta(options.task);
		return;
	},
	removeCompleted: function (completedId) {
		var taskId = Completed.findOne({_id: completedId}).task;
		Completed.remove({_id: completedId});
		updateTaskMeta(taskId);
		return;
	},
	undoRemoveCompleted: function (completed) {
		if (!Completed.findOne({_id: completed._id})){
			Completed.insert(completed);
			updateTaskMeta(completed.task);
			return; 
		}
	}
});

var updateTaskMeta = function (taskId) {
	var currentTask = Tasks.findOne({_id: taskId});
	var options = {
		id: taskId,
		task: {
			schedule: currentTask.schedule
		}
	};
	var tasksCompleted = Completed.find({task: taskId}, {sort: {at: -1}});
	var anyCompleted = false;
	if (tasksCompleted) {
		anyCompleted = true;
		var completedArray = tasksCompleted.fetch();
	}
	if (currentTask.schedule == 'adaptive') {
		if (anyCompleted) {
			options.task.lastCompleted = new Data(completedArray[0].at);
			
		} else {
			options.task.lastCompleted = null;
			options.task.dueEvery = null;
			options.task.dueNext = null;
		}
	} else if (currentTask.schedule == 'hybrid') {
		if (anyCompleted) {
			options.task.lastCompleted = new Data(completedArray[0].at);
			
		} else {
			options.task.lastCompleted = null;
			options.task.dueNext = null;
		}
	} else if (currentTask.schedule == 'strict') {
		if (anyCompleted) {
			options.task.lastCompleted = new Data(completedArray[0].at);
			
		} else {
			options.task.lastCompleted = null;
		}
	}
	console.log(taskId);
	Meteor.call('editTask', options, function (err) {
		if (err) throw err;
	});
};
