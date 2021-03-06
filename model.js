Groups = new Meteor.Collection('groups');
Tags = new Meteor.Collection('tags');
Tasks = new Meteor.Collection('tasks');
Completed = new Meteor.Collection('completed');
Notifications = new Meteor.Collection('notifications');

Meteor.users.deny({
  update: function() {
    return true;
  }
});


Meteor.methods({
	setNickname: function (nickname) {
		var userId = Meteor.user()._id;
		Meteor.users.update({_id: userId}, {$set: {"profile.nickname":nickname}});
		var groups = Meteor.user().profile.groups;
		groups.forEach(function (groupId) {
			var group = Groups.findOne({_id: groupId});
			if (group) {
				var groupMembers = group.members;
				groupMembers[userId] = nickname;
				Groups.update({_id: group._id},{$set: {members: groupMembers}});				
			}
		});
	},
	newGroup: function (group) {
		return Groups.insert(group);
	},
	editGroup: function (options) {
		return Groups.update({_id: options.id}, {$set: options.group});		
	},
	joinGroup: function (options) {
		if (Meteor.isServer) {
			var group = Groups.findOne({name: options.name});
			if (group) {
				if (group.password == options.password) {
					var userGroups = Meteor.user().profile.groups;
					if (userGroups) userGroups.push(group._id);
					else userGroups = [group._id];
					Meteor.users.update({_id: Meteor.user()._id}, {$set:{
						"profile.groups": userGroups
					}});
					var groupMembers = group.members;
					var nickname = Meteor.user().profile.nickname;
					groupMembers[Meteor.user()._id] = nickname;
					return Groups.update({_id: group._id},{$set: {members: groupMembers}});
				}
				else throw new Meteor.Error('Incorrect group password');
			}
			throw new Meteor.Error('Could not find group named: "'+options.name+'"');
		}
	},
	leaveGroup: function (groupId) {
		var group = Groups.findOne({_id: groupId});
		if (group) {
			var userGroups = Meteor.user().profile.groups;
			var index = userGroups.indexOf(groupId);
			if (index > -1) {
				userGroups.splice(index, 1);
				Meteor.users.update({_id: Meteor.user()._id}, {$set:{
					"profile.groups": userGroups
				}});
				var groupMembers = group.members;
				delete groupMembers[Meteor.user()._id];
				return Groups.update({_id: group._id},{$set: {members: groupMembers}});				
			}
			throw new Meteor.Error('Not a member of '+group.name);
		}
		throw new Meteor.Error('Could not find group');
	},
	newTag: function (tag) {
		return Tags.insert(tag);
	},
	editTag: function (options) {
		return Tags.update({_id: options.id}, {$set: {name: options.name}});
	},
	deleteTag: function (tagId) {
		Tasks.update({user: Meteor.user()._id, tag: tagId}, {$set: {tag: 'default'}});
		return Tags.remove({_id: tagId});
	},
	newTask: function (task) {
		Tasks.insert(task);
		updateTagMeta({tag:task.tag});
	},
	editTask: function (options) {
		var task = Tasks.findOne({_id: options.id})
		var oldSchedule = task.schedule;
		Tasks.update({_id: options.id}, {$set: options.task});
		updateTagMeta({group:task.group});
		if (oldSchedule != options.task.schedule) {
			updateTaskMeta(options.id);
		}
	},
	deleteTask: function (taskId) {
		Completed.remove({task: taskId});
		var tag = Tasks.findOne({_id: taskId}).tag;
		Tasks.remove({_id: taskId});
		updateTagMeta(tag);
	},
	completeTask: function (options) {
		var task = Tasks.findOne({_id: options.task});
		var completed = Completed.insert(options);
		if (task) {

				var groupId = task.group;
				if (groupId != 'default') {
					var group = Groups.findOne({_id: groupId});
					if (group) {
						var members = group.members;
						var data = {
							group: {
								id: task.group,
								name: group.name
							},
							task: {
								id: task._id,
								name: task.name
							},
							user: {
								id: options.user,
								name: members[options.user]
							},
							at: options.at
						}
						delete members[options.user];
						var options = {
							type: 'completed',
							id: completed,
							meta: data
						};
						notifyGroup(members, options);
					}
				}

		}
			return completed;

	},
	removeCompleted: function (completedId) {
		var taskId = Completed.findOne({_id: completedId}).task;
		Completed.remove({_id: completedId});
		Notifications.remove({type:'completed', id: completedId});
		updateTaskMeta(taskId);
		return;
	},
	undoRemoveCompleted: function (completed) {
		if (!Completed.findOne({_id: completed._id})){
			Completed.insert(completed);
			updateTaskMeta(completed.task);
			return; 
		}
	},
	removeNotification: function (id) {
		return Notifications.remove({_id: id});
	}
});

var notifyGroup = function (members, options) {
	for (var userId in members) {
		Notifications.insert({
			user: userId,
			type: options.type,
			id: options.id,
			data: options.meta
		});
	}
};

updateTagMeta = function (options) {
	var tagId = options.tag;
	var groupId = options.group;
	if (tagId) {
		if (tagId != 'default') {
			var taggedTasks = Tasks.find({tag: tagId}).count();
			Tags.update({_id: tagId}, {$set: {tasks: taggedTasks}});
		}
	}
	else if (groupId) {
		var tags = Tags.find({group: groupId});
		tags.forEach(function (tag) {
			var taggedTasks = Tasks.find({tag: tag._id}).count();
			Tags.update({_id: tag._id}, {$set: {tasks: taggedTasks}});			
		});
	}

};

updateTaskMeta = function (taskId) {
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
		} else if (currentTask.schedule == 'lenient') {
			options.task.dueNext = new Date(lastCompleted + (currentTask.dueEvery * (1000 * 60 * 60 * 24)));
		} else if (currentTask.schedule == 'strict') {
			var dayLastCompleted = new Date(options.task.lastCompleted.toDateString());
			var dayDue = new Date(currentTask.dueNext.toDateString());
			if (dayLastCompleted >= dayDue) {
				var dueNext = currentTask.dueNext.getTime() + (currentTask.dueEvery * (1000 * 60 * 60 * 24));
				while (options.task.lastCompleted.getTime() > dueNext) {
					dueNext = dueNext + (currentTask.dueEvery * (1000 * 60 * 60 * 24));
				}
				options.task.dueNext = new Date(dueNext);
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
