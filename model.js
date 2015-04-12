Tags = new Meteor.Collection('tags');

Meteor.methods({
	newTag: function (tag) {
		return Tags.insert(tag);
	},
	editTag: function (options) {
		return Tags.update({_id: options.id}, {$set: {name: options.name}});
	},
	deleteTag: function (tagId) {
		return Tags.remove({_id: tagId});
	}
});
