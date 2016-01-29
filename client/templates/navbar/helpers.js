Template.navbar.helpers({
  brandRoute: () => {
    const group = Roles.getGroupsForUser(Meteor.userId());
    const route = {};
    if (group.length) {
      route.href = FlowRouter.path('groupPage', {groupId: group[0]});
    }
    else {
      route.href = '/';
    }
    return route;
  },
  groupRoute: () => {
    const group = Roles.getGroupsForUser(Meteor.userId());
    const route = {};
    if (group) {
      route.href = FlowRouter.path('groupPage', {groupId: group[0]});
    }
    else {
      route.href = FlowRouter.path('groupIndex');
    }
    return route;

  },
  inGroup: () => {
    return Roles.getGroupsForUser(Meteor.userId());
  },
  activeGroup: (group) => {
    FlowRouter.watchPathChange();
    const currentGroup = FlowRouter.current().route.group;
    if (currentGroup) 
      return (currentGroup.name == group+'Routes' && 'active');
    return '';
  },
  activeRoute: (route) => {
    return (ActiveRoute.name(route) && 'active');
  }
});
