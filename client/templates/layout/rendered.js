Template.taskurbateLayout.onRendered(function () {
  const self = this;
  self.autorun(function () {
    const groupIds = Roles.getGroupsForUser(Meteor.userId());
    if (groupIds.length) {
      const group = Groups.findOne(groupIds[0]);
      if (group)
        self.subscribe('groupMates', group.members);
    }
  });
  $('#modal').on('hidden.bs.modal', () => {
    Session.set('modalTemplate', null);
    Session.set('modalData', null);
  });
});
