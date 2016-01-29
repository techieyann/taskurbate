AutoForm.hooks({
  newTaskForm: {
    before: {
      method: function (newTask) {
        this.removeStickyValidationError('name');
        newTask.period = newTask.period * (1000 * 60 * 60 * 24);
        newTask.groupId = Roles.getGroupsForUser(Meteor.userId())[0];
        return newTask;
      }
    },
    onError: function (type, error) {
      console.log(type);
      console.log(error);
      if (error.error == 'Tasks.methods.newTask.nameExists') {
        this.addStickyValidationError('name', 'nameExists');
      }
    },
    onSuccess: (type, result) => {
      $('#modal').modal('hide');
    }
  }
});
