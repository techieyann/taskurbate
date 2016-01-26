Groups.methods.newGroup = new ValidatedMethod({
  name: 'Groups.methods.newGroup',
  validate: new SimpleSchema({
    name: { type: String },
    code: { type: String },
    quota: { type: Boolean }
  }).validator(),
  run (newGroup) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.newGroup.notLoggedIn',
        'Not logged in',
        'Must be logged in to create group'
      );
    }
    if (Groups.findOne({name: newGroup.name})) {
      throw new Meteor.Error(
        'Groups.methods.newGroup.nameExists',
        'Group names must be unique',
        'Group already exists with name: '+ newGroup.name
      );
    }
    else {
      newGroup.members = [this.userId];
      const id = Groups.insert(newGroup);
      if(!this.isSimulation) {
        Roles.addUserToRole(this.userId, 'admin', 'group'+id);
      }
      Tags.methods.newTag.call({
        groupId: id,
        name: 'Misc.'
      }, (error, result) => {
        if (error) console.log(error);
      });
      return id;
    }
  }
});

Groups.methods.editGroup = new ValidatedMethod({
  name: 'Groups.methods.editGroup',
  validate: new SimpleSchema({
    groupId: { type: String },
    name: { type: String },
    quota: { type: Boolean }
  }).validator(),
  run (editGroup) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.editGroup.notLoggedIn',
        'Not logged in',
        'Must be logged in to edit group'
      );
    }
    const group = Groups.findOne(editGroup.groupId);
    if (!group) {
      throw new Meteor.Error(
        'Groups.methods.editGroup.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!group.userIsAdmin()) {
      throw new Meteor.Error(
        'Groups.methods.editGroup.unauthorized',
        'Unauthorized user',
        'Must be group admin to edit group'
      );
    }
    delete editGroup.groupId;
    Groups.update(group._id, {$set: editGroup});
  }
});

Groups.methods.changeCode = new ValidatedMethod({
  name: 'Groups.methods.changeCode',
  validate: new SimpleSchema({
    groupId: { type: String },
    newCode: { type: String }
  }).validator(),
  run({ groupId, newCode }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.changeCode.notLoggedIn',
        'Not logged in',
        'Must be logged in to change group code'
      );
    }
    const group = Groups.findOne(groupId);
    if (!group) {
      throw new Meteor.Error(
        'Groups.methods.changeCode.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!group.userIsAdmin()) {
      throw new Meteor.Error(
        'Groups.methods.changeCode.unauthorized',
        'Unauthorized user',
        'Must be group admin to change code'
      );
    }
    Groups.update(groupId, {$set: {code: newCode}});
  }
});

Groups.methods.joinGroup = new ValidatedMethod({
  name: 'Groups.methods.changeCode',
  validate: new SimpleSchema({
    groupId: { type: String },
    accessCode: { type: String }
  }).validator(),
  run({ groupId, accessCode }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.joinGroup.notLoggedIn',
        'Not logged in',
        'Must be logged in to joinGroup'
      );
    }
    if(Roles.getGroupsForUser(this.userId)) {
      throw new Meteor.Error(
        'Groups.methods.joinGroup.alreadyInGroup',
        'User already connected to group',
        'You are already associated with a group'
      );
    }
    const group = Groups.findOne(groupId);
    if (!group) {
      throw new Meteor.Error(
        'Groups.methods.joinGroup.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!this.isSimulation) {
      if (group.code != accessCode) {
        throw new Meteor.Error(
          'Groups.methods.joinGroup.badCode',
          'Incorrect code',
          'Bad access code for group: '+group.name
        );
      }
      else {
        Roles.addUserToRole(this.userId, 'member', 'group'+groupId);
      }
    }
    Groups.update(groupId, {$push: {members: this.userId}});
  }
});

Groups.methods.leaveGroup = new ValidatedMethod({
  name: 'Groups.methods.leaveGroup',
  validate: new SimpleSchema({
    groupId: { type: String }    
  }).validator(),
  run({ groupId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.leaveGroup.notLoggedIn',
        'Not logged in',
        'Must be logged in to leave group'
      );
    }
    const group = Groups.findOne(groupId);
    if (!group) {
      throw new Meteor.Error(
        'Groups.methods.leaveGroup.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (group.userIsAdmin()) {
      throw new Meteor.Error(
        'Groups.methods.leaveGroup.adminDisallowed',
        'Admin cannot leave group',
        'You are the admin of this group and cannot leave it'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'member', 'group'+groupId)) {
      throw new Meteor.Error(
        'Groups.methods.leaveGroup.notInGroup',
        'User not in group',
        'You are not a member of group: '+group.name
      );
    }
    if (!this.isSimulation) {
      Roles.removeUserFromRoles(this.userId, 'member', 'group'+groupId);
    }
    Groups.update(groupId, {$pull: {members: this.userId}});
  }
});

Groups.methods.resetTasks = new ValidatedMethod({
  name: 'Groups.methods.resetTasks',
  validate: new SimpleSchema({
    groupId: { type: String }
  }).validator(),
  run({ groupId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Groups.methods.resetTasks.notLoggedIn',
        'Not logged in',
        'Must be logged in to reset tasks for group'
      );
    }
    const group = Groups.findOne(groupId);
    if (!group) {
      throw new Meteor.Error(
        'Groups.methods.resetTasks.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!group.userIsAdmin()) {
      throw new Meteor.Error(
        'Groups.methods.resetTasks.unauthorized',
        'User not admin of group',
        'Must be admin of group to reset tasks'
      );
    }
    Tasks.find({groupId: groupId}).forEach(function (task) {
      Completions.remove({taskId: task._id}, {multi: true});
    });
    Meteor.methods.call('resetMemberQuotas', group._id);
  }
});
