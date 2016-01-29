Template.newTask.onRendered(function () {
  const self = this;
  self.autorun(function () {
    const groups = Roles.getGroupsForUser(Meteor.userId());
    if (groups.length) {
      self.group.set(Groups.findOne(groups[0]));
    }
  });
});
