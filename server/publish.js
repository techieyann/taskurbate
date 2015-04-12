Meteor.publish('tags', function (userId) {
	return Tags.find({user: userId});
});
