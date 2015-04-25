Meteor.publish('notifications', function (userId) {
	if (userId)	return Notifications.find({user: userId});
	return this.ready();
});

Meteor.publish('tags', function (userId, groupArray) {
	if (userId && groupArray) return Tags.find({$or: [{user: userId},{group: {$in: groupArray}}]});
	return this.ready();
});

Meteor.publish('tasks', function (userId, groupArray) {
	if (userId || groupArray) return Tasks.find({$or: [{user: userId},{group: {$in: groupArray}}]});
	return this.ready();
});

Meteor.publish('completed', function (userId, groupArray) {
	if (userId || groupArray) return Completed.find({$or: [{user: userId},{group: {$in: groupArray}}]});
	return this.ready();
});

Meteor.publish('groups', function (groupArray) {
	if (groupArray) return Groups.find({_id: {$in: groupArray}}, {fields: {password: 0}});
//	return Groups.find({}, {fields: {password: 0}});
	return this.ready();
});
