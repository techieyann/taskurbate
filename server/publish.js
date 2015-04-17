Meteor.publish('tags', function (userId) {
	return Tags.find({user: userId});
});

Meteor.publish('tasks', function (userId) {
	return Tasks.find({user: userId});
});

Meteor.publish('completed', function (userId) {
	return Completed.find({user: userId});
});
