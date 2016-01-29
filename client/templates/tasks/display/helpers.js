Template.displayTask.helpers({
  taskWeight: () => {
    return Template.instance().data.task.quotaValue();
  }
});
