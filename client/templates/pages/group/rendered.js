Template.groupPage.onRendered(function () {
  const self = this;
  this.autorun(function () {
    const groupId = FlowRouter.getParam('groupId');
    const group = Groups.findOne(groupId);
    const members = Meteor.users.find().fetch();
    if (members.length && group) {
      const completions = group.calcMembersWeeklyCompletion();
      const lastMonday = moment().day(1).toDate();
      const nextMonday = moment().day(8).toDate();
      members.forEach( (member, index) => {
        members[index].completed = completions[member._id];
        const memberPresence = memberPresenceInRange(member._id, lastMonday, nextMonday);
        if (group.weeklyQuota) {
          members[index].weeklyQuota = memberPresence*group.weeklyQuota;
        }
        const lastCompletion = Completions.findOne({user: member._id}, {sort: {date: -1}});
        if (lastCompletion) {
          const lastTask = Tasks.findOne(lastCompletion.taskId);
          members[index].lastCompleted = {
            task: lastTask,
            at: lastCompletion.date
          };
        }
      });
    }
    self.members.set(members);
    self.group.set(group);
  });
});
