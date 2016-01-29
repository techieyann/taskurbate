Template.displayTag.events({
  'click .edit-tag': () => {
    const instance = Template.instance();
    instance.data.setEdit(instance.data.tag);
  },
  'click .delete-tag': () => {
    const instance = Template.instance();
    const tag = instance.data.tag;
    openModal('deleteTag', {tag});
  }
});
