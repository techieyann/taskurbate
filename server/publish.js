Meteor.publish('tags', function (userId) {
	return Tags.find({user: userId});
});

Meteor.publish('tasks', function (userId) {
	return Tags.find({user: userId});
});
