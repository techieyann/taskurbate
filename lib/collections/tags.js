Tags = new Meteor.collection('tags');

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
  numTasks: () => {
    return Tasks.find({tagId: this._id}).count();
  }
});
