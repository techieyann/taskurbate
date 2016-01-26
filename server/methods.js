Meteor.methods({
  'resetMemberQuotas': (groupId) => {
    if (!this.userId) {
      throw new Meteor.Error(
        'Meteor.methods.resetMemberQuotas.notLoggedIn',
        'Not logged in',
        'Must be logged in to reset member quotas'
      );
    }
    const group = Groups.findOne(groupId);
    if (!group) {
      throw new Meteor.Error(
        'Meteor.methods.resetMemberQuotas.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!group.userIsAdmin()) {
      throw new Meteor.Error(
        'Meteor.methods.resetMemberQuotas.unauthorized',
        'User not admin of group',
        'Must be admin of group to reset quotas'
      );
    }
    Meteor.users.update({_id: {$in: group.members}}, {$set: {quota: 0}}, {multi: true});
  }
});
