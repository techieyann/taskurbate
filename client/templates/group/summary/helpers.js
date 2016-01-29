Template.groupSummary.helpers({
  'groupAdmin': () => {
    const group = Template.instance().data.group;
    if (group) {
      return group.userIsAdmin();
    }
    return false;
  },
  'quota': () => {
    const group = Template.instance().data.group;
    return group && group.quota && group.weeklyQuota;
  },
  'quotaCompleted': () => {
    const instance = Template.instance();
    return instance.quotaCompleted.get();
  },
  'percentCompleted': () => {
    const instance = Template.instance();
    return instance.percentCompleted.get();
  }
});
