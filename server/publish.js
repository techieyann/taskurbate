Meteor.publish('notifications', function () {
return Notifications.find({user: this.userId});
});

Meteor.publish('tags', function (groupArray) {
	return Tags.find({$or: [{user: this.userId},{group: {$in: groupArray}}]});
});

Meteor.publish('tasks', function (groupArray) {
	return Tasks.find({$or: [{user: this.userId},{group: {$in: groupArray}}]});
});

Meteor.publish('completed', function (groupArray) {
	return Completed.find({$or: [{user: this.userId},{group: {$in: groupArray}}]});
});

Meteor.publish('groups', function (groupArray) {
	return Groups.find({_id: {$in: groupArray}}, {fields: {password: 0}});
});
