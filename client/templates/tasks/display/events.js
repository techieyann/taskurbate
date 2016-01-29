Template.displayTask.events({
  'click .edit-task': () => {
    let tagArray = [];
    const instance = Template.instance();
    const tags = instance.data.tags;
    const task = instance.data.task;
    if (tags) {
      tagArray = tags.map( (tag) => {
        const option = {
          label: tag.name,
          value: tag._id
        };
        if (tag._id == task.tagId) {
          option.selected = true;
        }
        
        return option;
      });
    }
    const formData = {
      task: Template.instance().data.task,
      tags: tagArray,
      mode: 'edit'
    };
    openModal('taskForm', formData);
  },
  'click .delete-task': () => {
    console.log('delete task');
  }
});
