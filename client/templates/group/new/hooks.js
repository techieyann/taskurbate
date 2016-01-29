AutoForm.hooks({
  newGroupForm: {
    before: {
      method: function (newGroup) {
        this.removeStickyValidationError('name');
        newGroup.members = [Meteor.userId()];
        return newGroup;
      }
    },
    onError: function (type, error) {
      if (error.error == 'Groups.methods.newGroup.nameExists') {
        this.addStickyValidationError('name', 'nameExists');
      }
      else {
        console.log(error);
      }

    },
    onSuccess: (type, result) => {
      FlowRouter.go('groupPage', {groupId: result});
    }
  }
});
