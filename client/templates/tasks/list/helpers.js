Template.listTasks.helpers({
  tagsWithTasks: () => {
    const tags = Template.instance().data.tags;
    const tasks = Template.instance().data.tasks;
    if (tags) {
      return tags.filter( (tag) => {
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
  }
});
