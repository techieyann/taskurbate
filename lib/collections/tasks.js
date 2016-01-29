Tasks = new Meteor.Collection('tasks');

Tasks.methods = {};

Tasks.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 128
  },
  description: {
    type: String,
    label: 'Brief description',
    max: 512,
    optional: true
  },
  groupId: {
    type: String,
    label: 'Group',
    regEx: SimpleSchema.RegEx.Id
  },
  tagId: {
    type: String,
    label: 'Tag',
    regEx: SimpleSchema.RegEx.Id
  },
  weight: {
    type: Number,
    label: 'Task difficulty',
    min: 1,
    max: 10
  },
  scheduleType: {
    type: String,
    label: 'Schedule Type',
    allowedValues: ['Automatic','Strict'],
    defaultValue: 'Automatic'
  },
  period: {
    type: Number,
    label: 'Due every (days)',
    min: 1,
    defaultValue: 1
  },
  due: {
    type: Date,
    label: 'Due next',
    defaultValue: new Date()
  }
});

Tasks.schema.messages({
  nameExists: 'Task already exists with that name'
});

Tasks.attachSchema(Tasks.schema);

Tasks.helpers({
  lastCompleted: () => {
    const completed = Completions.findOne({taskId: this._id}, {sort: {date: -1}});
    return (!!completed && completed.at);
  },
  lastCompletedBy: function (userId) {
    const completed = Completions.find({taskId: this._id, by: userId}, {sort: {date: -1}});
    return (!!completed && completed.at);
  },
  timesCompleted: function () {
    return Completions.find({taskId: this._id}).count();
  },
  timesCompletedBy: function (userId) {
    return Completions.find({taskId: this._id, by: userId}).count();
  },
  quotaValue: function () {
    let dueDelta = (Date.now() - this.due.getTime()) / this.period;
    console.log(dueDelta);
    if (this.scheduleType == 'Strict')
      dueDelta = 0;
    return Math.round(this.weight +  (dueDelta * this.weight));
  },
  calculatePeriod: function () {
    const completions = Completions.find({taskId: this._id}, {sort: {date: 1}}).fetch();
    if (completions.length > 1) {
      let period = 0;
      completions.reduce(function (prev, curr, index) {
        const diff = curr.date - prev.date;
        if (period == 0) period = diff;
        else {
          period = ((period * index) + diff)/(index+1);
        }
      });
      return period;
    }
    else return this.period;
  }
});
