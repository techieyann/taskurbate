Meteor.publish('tags', function (userId, groupArray) {
	return Tags.find({$or: [{user: userId},{group: {$in: groupArray}}]});
});

Meteor.publish('tasks', function (userId, groupArray) {
	return Tasks.find({$or: [{user: userId},{group: {$in: groupArray}}]});
});

Meteor.publish('completed', function (userId, groupArray) {
	return Completed.find({$or: [{user: userId},{group: {$in: groupArray}}]});
});

Meteor.publish('groups', function (groupArray) {
	if (groupArray) return Groups.find({_id: {$in: groupArray}}, {fields: {password: 0}});
	return Groups.find({}, {fields: {password: 0}});
});
