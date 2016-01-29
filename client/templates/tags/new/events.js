Template.newTag.events({
  'submit #new-tag-form': (e) => {
    e.preventDefault();
    const instance = Template.instance();
    const newTag = {
      name: $('#new-tag-name').val(),
      groupId: instance.data.group._id
    };
    if (newTag.name && newTag.groupId) {
      Tags.methods.newTag.call(newTag, (err) => {
        if (err) {
          console.log(err);
          if (err.error == 'Tags.methods.newTag.nameExists') {
            $('#'+err.reason.id).fadeOut().fadeIn();
          }
        }
        $('#new-tag-name').val('');
      });
    }
  }
});
