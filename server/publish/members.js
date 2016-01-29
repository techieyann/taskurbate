Meteor.publish('groupMates', function (memberArray) {
  return Meteor.users.find({_id: {$in: memberArray}}, {fields: {'quota': 1, 'name': 1}});
});
