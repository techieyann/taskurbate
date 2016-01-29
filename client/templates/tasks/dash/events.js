Template.tasksDash.events({
  'click #new-task-button': (e) => {
    const tags = Template.instance().data.tags;
    let tagArray = [];
    if (tags) {
      tagArray = tags.map( (tag) => {
        return {
          label: tag.name,
          value: tag._id
        };
      });
    }
    openModal('newTask', {tags: tagArray});
  }
});
