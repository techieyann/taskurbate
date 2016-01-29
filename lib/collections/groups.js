Groups = new Meteor.Collection('groups');

Groups.methods = {};

Groups.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 100
  },
  accessCode: {
    type: String,
    label: 'Access Code',
    max: 100
  },
  members: {
    type: [String],
    label: 'Array of groupmate member IDs'
  },
  quota: {
    type: Boolean,
    label: 'Weekly task quota',
    defaultValue: true
  },
  weeklyQuota: {
    type: Number,
    label: 'Weekly quota value',
    optional: true
  }
});

Groups.schema.messages({
  nameExists: 'Group already exists'
});

Groups.attachSchema(Groups.schema);

Groups.helpers({
  tasks: function () {
    return Tasks.find({groupId: this._id});
  },
  sortedTasks: function (order) {
    return Tasks.find({groupId: this._id}, {sort: order});
  },
  tags: function () {
    return Tags.find({groupId: this._id}, {sort: {name: 1}});
  },
  userIsAdmin: function () {
    
    return Roles.userIsInRole(Meteor.userId(), 'admin', this._id);
  },
  calcMembersWeeklyCompletion: function () {
    const lastMonday = moment().day(1).toDate();
    const memberCompletion = {};
    this.members.forEach( (memberId) => {
      const completions = Completions.find({user: memberId, date: {$gt: lastMonday}}).fetch();
      let total = 0;
      completions.forEach( (completion) => {
        total += completion.value;
      });
      memberCompletion[memberId] = total;
    });
    return memberCompletion;
  }
});
