Completions = new Meteor.Collection('completions');

Completions.methods = {};

Completions.schema = new SimpleSchema({
  taskId: {
    type: String,
    label: 'Task completed',
    regEx: SimpleSchema.RegEx.Id
  },
  date: {
    type: Date,
    label: 'Completed on'
  },
  user: {
    type: String,
    label: 'Completed by',
    regEx: SimpleSchema.RegEx.Id
  },
  value: {
    type: Number,
    label: 'Value for quota'
  }
});

Completions.attachSchema(Completions.schema);
