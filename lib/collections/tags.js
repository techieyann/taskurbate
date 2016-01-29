Tags = new Meteor.Collection('tags');

Tags.methods = {};

Tags.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 100
  },  
  groupId: {
    type: String,
    label: 'Group',
    regEx: SimpleSchema.RegEx.Id
  }
});

Tags.attachSchema(Tags.schema);

Tags.helpers({
  numTasks: function () {
    return Tasks.find({tagId: this._id}).count();
  }
});

Tags.arrayByGroup = function (groupId) {
  const tagArray = this.find({groupId: groupId, name: {$ne: 'Misc.'}}, {sort: {name: 1}}).fetch();
  tagArray.unshift(this.findOne({groupId: groupId, name: 'Misc.'}));
  return tagArray;
};
