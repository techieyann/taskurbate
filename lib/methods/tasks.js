Tasks.methods.newTask = new ValidatedMethod({
  name: 'Tasks.methods.newTask',
  validate: new SimpleSchema({
    groupId: { type: String },
    tagId: { type: String },
    name: { type: String },
    period: { type: Number },
    scheduleType: { type: String },
    due: { type: Date },
    weight: {type: Number},
    description: {
      type: String,
      optional: true
    }
  }).validator(),
  run (newTask) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.notLoggedIn',
        'Not logged in',
        'Must be logged in to create task'
      );
    }
    const group = Groups.findOne(newTask.groupId);
    if (!group) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.unknownGroup',
        'Unknown groupId',
        'Specified group could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, ['admin', 'member'], 'group'+newTask.groupId)) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.notInGroup',
        'User not in group',
        'You are not a member of group: '+group.name
      );
    }
    const tag = Tags.findOne(newTask.tagId);
    if (!tag) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.unknownTag',
        'Unknown tagId',
        'Specified tag could not be found'
      );
    }
    if (Tasks.findOne({groupId: newTask.groupId, name: newTask.name})) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.nameExists',
        'Task names must be unique per group',
        group.name+' already has task named: '+newTask.name
      );
    }
    return Tasks.insert(newTask);
  }
});

Tasks.methods.editTask = new ValidatedMethod({
  name: 'Tasks.methods.editTask',
  validate: new SimpleSchema({
    taskId: { type: String },
    tagId: { type: String },
    name: { type: String },
    period: { type: Number },
    scheduleType: { type: String },
    due: { type: Date },
    weight: { type: Number },
    description: {
      type: String,
      optional: true
    }
  }).validator(),
  run (editTask) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tasks.methods.editTask.notLoggedIn',
        'Not logged in',
        'Must be logged in to edit task'
      );
    }
    const task = Tasks.findOne(editTask.taskId);
    if (!task) {
      throw new Meteor.Error(
        'Tasks.methods.editTask.unknownTask',
        'Unknown taskId',
        'Specified task could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin', 'group'+task.groupId)) {
      throw new Meteor.Error(
        'Tasks.methods.editTask.notInGroup',
        'User not in group admin',
        'Must be admin of task\'s group to edit task'
      );
    }
    const tag = Tags.findOne(editTask.tagId);
    if (!tag) {
      throw new Meteor.Error(
        'Tasks.methods.editTask.unknownTag',
        'Unknown tagId',
        'Specified tag could not be found'
      );
    }
    if (Tasks.findOne({_id: {$ne: editTask.taskId}, groupId: editTask.groupId, name: editTask.name})) {
      throw new Meteor.Error(
        'Tasks.methods.newTask.nameExists',
        'Task names must be unique per group',
        'Group already has task named: '+editTask.name
      );
    }
    delete editTask.taskId;
    return Tasks.update(task._id, {$set: editTask});
  }
});

Tasks.methods.deleteTask({
  name: 'Tasks.methods.deleteTask',
  validate: new SimpleSchema({
    taskId: {type: String}
  }).validator(),
  run({ taskId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Tasks.methods.deleteTask.notLoggedIn',
        'Not logged in',
        'Must be logged in to delete task'
      );
    }
    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error(
        'Tasks.methods.deleteTask.unknownTask',
        'Unknown taskId',
        'Specified task could not be found'
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin', 'group'+task.groupId)) {
      throw new Meteor.Error(
        'Tasks.methods.deleteTask.notInGroup',
        'User not group admin',
        'Must be admin of task\'s group to delete task'
      );
    }
    Completions.remove({taskId: taskId}, {multi: true});
    Tasks.remove(taskId);
  }
});

Tasks.methods.updateSchedule = new ValidatedMethod({
  name: 'Tasks.methods.updateFrequency',
  validate: new SimpleSchema({
    taskId: {type: String}
  }).validator(),
  run({ taskId }) {
    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error(
        'Tasks.methods.updateFrequency.unknownTask',
        'Unknown taskId',
        'Specified task could not be found'
      );
    }
    const lastCompleted = task.lastCompleted();
    if (!this.isSimulation && lastCompleted) {
      switch (task.scheduleType) {
      case 'Strict':
        let dayLastCompleted = new Date(lastCompleted.toDateString());
        let dayDue = new Date(task.due.toDateString());
        if (dayLastCompleted > dayDue) {
          let dueNext = dayDue + task.period;
          while (dayLastCompleted > dueNext) {
            dueNext += task.period;
          }
          Tasks.update(taskId, {$set: {due: dueNext}});
        }
        break;
      case 'Automatic':
        const newPeriod = task.calculatePeriod();
        Tasks.update(taskId, {$set: {period: newPeriod, due: lastCompleted + newPeriod}});
        break;
      }
    }
  }
});
