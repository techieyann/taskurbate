Template.listTasks.helpers({
  tagsWithTasks: () => {
    const tags = Template.instance().data.tags;
    const tasks = Template.instance().data.tasks;
    if (tags) {
      return tags.filter( (tag) => {
        console.log(tag.numTasks());
        return (tag.numTasks() > 0);
      });
    }
  },
  tagGroup: (tag) => {
    const tasks = Template.instance().data.tasks;
    if (tasks) {
      return tasks.fetch().filter( (task) => {
        return task.tagId == tag._id;
      });
    }
  },
  taskWeight: (task) => {
    return task.quotaValue();
  }
});
