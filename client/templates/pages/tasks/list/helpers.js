Template.listTasksPage.helpers({
  'listOptions': () => {
    const instance = Template.instance();
    const group = instance.group.get();
    let options = {};
    if (group) {
      const tags = Tags.arrayByGroup(group._id);
      const tasks = Tasks.find({groupId: group._id});
      options = {
        group,
        tasks,
        tags
      };
    }
    return options;
  }
});
