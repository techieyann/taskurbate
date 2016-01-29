redirectToGroup = function () {
  const userId = Meteor.userId();
  if (Meteor.user()) {
    const group = Roles.getGroupsForUser(userId);
    if (group.length) {
      Meteor.setTimeout(()=>{
        FlowRouter.go('groupPage', {groupId: group[0]});
      });
    }
    else {
      const routeName = FlowRouter.current().route.name;
      if (routeName != 'joinGroup' && routeName != 'newGroup') {
        Meteor.setTimeout(()=>{
          FlowRouter.go('joinGroup');
        });
      }
    }
  }
};
