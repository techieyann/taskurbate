Template.groupPage.helpers({
  'groupArray': () => {
    return [FlowRouter.getParam('groupId')];
  },
  'dashOptions': (groupId) => {
    const instance = Template.instance();
    const group = instance.group.get();
    const tasks = Tasks.find({groupId: groupId},{sort: {due:1}, limit: 5});
    const members = instance.members.get();
    return {
      group, 
      tasks,
      members
    };
  }
});
