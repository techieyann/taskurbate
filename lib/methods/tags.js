Tags.methods.newTag = new ValidatedMethod({
  name: 'Tags.methods.newTag',
  validate: new SimpleSchema({
    name: { type: String },
    groupId: { type: String }
  }).validator(),
  run (newTag) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tags.methods.newTag.notLoggedIn',
        'Not logged in',
        'Must be logged in to create tag'
      );
    }
    const group = Groups.findOne(newTag.groupId);
    if (!group) {
      throw new Meteor.Error(
        'Tags.methods.newTag.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin', 'group'+newTag.groupId)) {
      throw new Meteor.Error(
        'Tags.methods.newTag.notGroupAdmin',
        'Must be admin of group',
        'You are not an admin of group: '+group.name
      );
    }
    if (Tags.findOne({name: newTag.name})) {
      throw new Meteor.Error(
        'Tags.methods.newTag.nameExists',
        'Tag with name already exists',
        group.name+' already has tag named '+newTag.name
      );
    }
    return Tags.insert(newTag);
  }
});

Tags.methods.editTag = new ValidatedMethod({
  name: 'Tags.methods.editTag',
  validate: new SimpleSchema({
    tagId: { type: String },
    name: { type: String }
  }).validator(),
  run({ tagId, name }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tags.methods.editTag.notLoggedIn',
        'Not logged in',
        'Must be logged in to edit tag'
      );
    }
    const tag = Tags.findOne(tagId);
    if (!tag) {
      throw new Meteor.Error(
        'Tags.methods.editTag.unknownTag',
        'Unknown tagId',
        'Specified tag could not be found'
      );
    }
    if (tag.name == 'Misc.') {
      throw new Meteor.Error(
        'Tags.methods.editTag.defaultTag',
        'Default tag can not be changed',
        'Can not rename default tag'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin', 'group'+tag.groupId)) {
      throw new Meteor.Error(
        'Tags.methods.editTag.notGroupAdmin',
        'Must be admin of group',
        'You are not an admin of tag\'s group'
      );
    }
    Tags.update(tagId, {$set: {name: name}});
  }
});

Tags.methods.deleteTag = new ValidatedMethod({
  name: 'Tags.methods.deleteTag',
  validate: new SimpleSchema({
    tagId: { type: String }
  }).validator(),
  run (tagId) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tags.methods.deleteTag.notLoggedIn',
        'Not logged in',
        'Must be logged in to delete tag'
      );
    }
    const tag = Tags.findOne(tagId);
    if (!tag) {
      throw new Meteor.Error(
        'Tags.methods.editTag.unknownTag',
        'Unknown tagId',
        'Specified tag could not be found'
      );
    }
    if (tag.name == 'Misc.') {
      throw new Meteor.Error(
        'Tags.methods.deleteTag.defaultTag',
        'Default tag can not be deleted',
        'Can not delete default tag'
      );
    }
    const defaultTag = Tags.findOne({name: 'Misc.', groupId: tag.groupId});
    if (!defaultTag) {
      throw new Meteor.Error(
        'Tags.methods.deleteTag.defaultTagNotFound',
        'Default tag not found',
        'Can not find default tag, this is really bad'
      );
    }
    if (tag.numTasks()) {
      Tasks.upate({tagId: tagId}, {$set: {tagId: defaultTag._id}}); 
    }
    Tags.remove(tagId);
  }
});
