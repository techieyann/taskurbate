Template.memberSummary.helpers({
  'quota': () => {
    const group = Template.instance().data.group;
    return group && group.quota && group.weeklyQuota;
  },
  'percentCompleted': () => {
    const member = Template.instance.data.member;
    if (member) {
      return member.completed/member.weeklyQuota;
    }
    return 0;
  }
});
