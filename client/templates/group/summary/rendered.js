Template.groupSummary.onRendered(function () {
  const self = this;
  self.autorun(function () {
    const group = self.data.group;
    let total = 0;
    if (group) {
      const memberCompletion = group.calcMembersWeeklyCompletion();
      for (let member in memberCompletion) {
        total += memberCompletion[member];
      }
    }
    self.quotaCompleted.set(total);
  });

  self.autorun(function () {
    const group = self.data.group;
    let percent = 0;
    if (group && group.weeklyQuota) {
      percent = self.quotaCompleted.get()/group.weeklyQuota;
    }
    self.percentCompleted.set(percent);
  });
});
