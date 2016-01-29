SyncedCron.add({
  name: 'calculateWeeklyQuotas',
  schedule: (parser) => {
    return parser.text('at 12:01 am on Monday');
  },
  job: () => {
    const quotaGroups = Groups.find({quota: true});
    quotaGroups.forEach( (group) => {

      //last week quota completion
      const weekStart = moment().day(-6).toDate();
      const weekEnd = moment().day(1).toDate();
      const memberPresence = {};

      group.members.forEach( (member) => {
        memberPresence[member] = memberPresenceInRange(member, weekStart, weekEnd);
      });
      
      const quota = group.weeklyQuota;
      if (quota) {
        const memberCompletion = group.calcMembersWeeklyCompletion();
        for (let member in memberCompletion) {
          const diff = memberCompletion[member] - (quota * memberPresence[member]);
          Meteor.users.update(member, {$inc: {quota: diff}});
        }
      }
      
      //next weeks quota calculation
      const now = Date.now();
      const monday = moment().day(8).toDate();
      
      let presentMembers = 0;
      group.members.forEach( (member) => {
          presentMembers += memberPresenceInRange(member, now, monday);
      });

      const tasks = Tasks.find({groupId: groupId}).fetch();
      let taskWeightDueBySunday = 0;
      
      tasks.forEach( (task) => {
        const mondayDelta = monday - task.due;
        if (mondayDelta < 0) {
          taskWeightDueBySunday += (Math.floor(task.period / mondayDelta) + 1) * task.weight;
        }
      });
      const newQuota = Math.ceil(taskWeightDueBySunday/presentMembers);
      Groups.update(groupId, {weeklyQuota: newQuota});
    });
  }
});
