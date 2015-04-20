Groups = new Meteor.Collection('groups');
Tags = new Meteor.Collection('tags');
Tasks = new Meteor.Collection('tasks');
Completed = new Meteor.Collection('completed');


Meteor.methods({
	setNickname: function (nickname) {
		return Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.nickname":nickname}});
	},
	newGroup: function (group) {
		return Groups.insert(group);
	},
	editGroup: function (options) {
		return Groups.update({_id: options.id}, {$set: options.group});		
	},
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
		var oldSchedule = Tasks.findOne({_id: options.id}).schedule;
		Tasks.update({_id: options.id}, {$set: options.task});
		if (oldSchedule != options.task.schedule) {
			updateTaskMeta(options.id);
		}
		return;
	},
	deleteTask: function (taskId) {
		Completed.remove({task: taskId});
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
	var tasksCompleted = Completed.find({task: taskId}, {sort: {at: 1}});
	var anyCompleted = false;
	if (tasksCompleted.count()) {
		anyCompleted = true;
		var completedArray = tasksCompleted.fetch();
	}
	if (anyCompleted) {
		var lastCompleted = completedArray[completedArray.length-1].at.getTime();
		options.task.lastCompleted = new Date(lastCompleted);
		if (currentTask.schedule == 'adaptive') {
			if (completedArray.length > 1) {
				var period = 0;
				for (var i=1; i<completedArray.length; i++) {
					var diff = completedArray[i].at - completedArray[i-1].at;
					if (i==1) period = diff;
					else period = ((period*i) + diff)/(i+1);
				}
				options.task.dueEvery = period / (1000 * 60 * 60 * 24);
				options.task.dueNext = new Date(lastCompleted + period);
			}
			else {
				options.task.dueNext = null;
				options.task.dueEvery = null;				
			}
		} else if (currentTask.schedule == 'hybrid') {
			options.task.dueNext = new Date(lastCompleted + (currentTask.dueEvery * (1000 * 60 * 60 * 24)));
		} else if (currentTask.schedule == 'strict') {
			if (options.task.lastCompleted > currentTask.dueNext) {
				options.task.dueNext = new Date(currentTask.dueNext.getTime() + (currentTask.dueEvery * (1000 * 60 * 60 * 24)));
			}
		}
	} else {
		options.task.lastCompleted = null;
		if (currentTask.schedule != 'strict') {
			options.task.dueNext = null;
		}
		if (currentTask.schedule == 'adaptive'){
			options.task.dueEvery = null;
		}
	}
	Meteor.call('editTask', options, function (err) {
		if (err) throw err;
	});
};
