Template.listTags.onCreated(function () {
  const self = this;
  self.editTag = new ReactiveVar();
  self.setEditTag = function (tag) {
    self.editTag.set(tag);
    if (tag) {
      Meteor.setTimeout(() => {
        $('#input-'+tag._id).focus();
      });
    }
  };
});
