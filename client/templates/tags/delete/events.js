Template.deleteTag.events({
  'click .delete-tag': function (e) {
    const instance = Template.instance();
    Tags.methods.deleteTag.call(instance.data.tag._id, (err) => {
      if (err) console.log(err);
      $('#modal').modal('hide');
    });
  }
});
