Completions.methods.completeTask = new ValidatedMethod({
  name: 'Completions.methods.completeTask',
  validate: new SimpleSchema({
    taskId: { type: String }
  }).validator(),
  run({ taskId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Completions.methods.completeTask.notLoggedIn',
        'Not logged in',
        'Must be logged in to complete task'
      );
    }
    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error(
        'Completions.methods.completeTask.unknownTask',
        'Unknown taskId',
        'Specified task could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, ['member', 'admin'], 'group'+task.groupId)) {
      throw new Meteor.Error(
        'Completions.methods.completeTask.notInGroup',
        'User not in group',
        'Must be member of task\'s group to complete task'
      );
    }
    Completions.insert({
      taskId,
      date: Date.now(),
      user: this.userId,
      value: task.quotaValue()
    });
    Tasks.methods.updateSchedule.call(taskId);
  }
});

Completions.methods.backdateTask = new ValidatedMethod({
  name: 'Completions.methods.backdateTask',
  validate: new SimpleSchema({
    taskId: { type: String },
    date: { type: Date }
  }).validator(),
  run({ taskId, date }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Completions.methods.backdateTask.notLoggedIn',
        'Not logged in',
        'Must be logged in to backdate task'
      );
    }
    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error(
        'Completions.methods.backdateTask.unknownTask',
        'Unknown taskId',
        'Specified task could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, ['member', 'admin'], 'group'+task.groupId)) {
      throw new Meteor.Error(
        'Completions.methods.backdateTask.notInGroup',
        'User not in group',
        'Must be member of task\'s group to backdate task'
      );
    }
    Completions.insert({
      taskId,
      date,
      user: this.userId
    });
    Tasks.methods.updateSchedule.call(taskId);
  }
});

Completions.methods.deleteCompletion = new ValidatedMethod({
  name: 'Completions.methods.deleteCompletion',
  validate: new SimpleSchema({
    completionId: { type: String }
  }).validator(),
  run({ completionId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Completions.methods.deleteCompletion.notLoggedIn',
        'Not logged in',
        'Must be logged in to complete task'
      );
    }
    const completion = Completions.findOne(completionId);
    if (!completion) {
      throw new Meteor.Error(
        'Completions.methods.deleteCompletion.unknownCompletion',
        'Unknown completionId',
        'Specified task completion could not be found'
      );
    }
    const task = Tasks.findOne(completion.taskId);
    if (!task) {
      throw new Meteor.Error(
        'Completions.methods.deleteCompletion.unknownTask',
        'Unknown taskId',
        'Task from completion could not be found, this should never happen. Uh oh'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin', 'group'+task.groupId) ||
       task.user != this.userId) {
      throw new Meteor.Error(
        'Completions.methods.deleteCompletion.unauthorized',
        'User does not have proper permissions',
        'You do not have permission to delete task completion'
      );
    }
    Completions.remove(completionId);
    Tasks.methods.updateSchedule.call(task._id);
  }
});
