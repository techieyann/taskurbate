Groups = new Meteor.collection('groups');

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
    type: [Object],
    label: 'Array of groupmate member IDs'
  },
  quota: {
    type: Boolean,
    label: 'Enforce group quota'
  },
  weeklyQuota: {
    type: Number,
    label: 'Weekly quota of tasks',
    optional: true
  }
});

Groups.attachSchema(Groups.schema);

Groups.helpers({
  tasks: () => {
    return Tasks.find({groupId: this._id});
  },
  sortedTasks: (order) => {
    return Tasks.find({groupId: this._id}, {sort: order});
  },
  tags: () => {
    return Tags.find({groupId: this._id}, {sort: {name: 1}});
  },
  userIsAdmin: () => {
    return Roles.isUserInRole(this.userId, 'admin', 'group'+this._id);
  },
  calcMembersWeeklyCompletion: () => {
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
