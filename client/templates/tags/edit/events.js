Template.editTag.events({
'click .cancel-edit-tag': (e) => {
    e.preventDefault();
    const instance = Template.instance();
    instance.data.setEdit(null);
  },
  'submit .edit-tag-form': (e) => {
    e.preventDefault();
    const instance = Template.instance();
    const tag = instance.data.tag;
    const editTag = {
      name: instance.$('.edit-tag-name').val(),
      tagId: tag._id
    };
    
    if (editTag.name && editTag.tagId) {
      if (editTag.name == tag.name) {
        instance.data.setEdit(null);
        return;
      }
      Tags.methods.editTag.call(editTag, (err) => {
        if (err) {
          if (err.error == 'Tags.methods.editTag.nameExists') {
            instance.$('.edit-tag-name').val(tag.name);
            $('#'+err.reason.id).fadeOut().fadeIn();
            return;
          }
        }
        instance.data.setEdit(null);
      });
    }
  }
});
