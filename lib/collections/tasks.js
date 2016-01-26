Tasks = new Meteor.collection('tasks');

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
  period: {
    type: Number,
    label: 'Due every',
    min: 1
  },
  scheduleType: {
    type: String,
    label: 'Type',
    allowedValues: ['Strict','Automatic']
  },
  due: {
    type: Date,
    label: 'Due next'
  }
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
  timesCompleted: () => {
    return Completions.find({taskId: this._id}).count();
  },
  timesCompletedBy: (userId) => {
    return Completions.find({taskId: this._id, by: userId}).count();
  },
  quotaValue: () => {
    const numMsPerDay = (1000 * 60 * 60 * 24);
    let dueDelta = Date.now() - this.due;
    if (this.scheduleType == 'Strict' || dueDelta < 0)
      dueDelta = 0;
    return this.weight +  (dueDelta / numMsPerDay);
  },
  calculatePeriod: () => {
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
