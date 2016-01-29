Template.listTasksPage.onRendered(function () {
  const self = this;
  this.autorun(function () {
    const groups = Roles.getGroupsForUser(Meteor.userId());
    if (groups.length) {
      const groupId = groups[0];
      const group = Groups.findOne(groupId);
      self.group.set(group);
    }
  });
});
