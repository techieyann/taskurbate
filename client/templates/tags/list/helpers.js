Template.listTags.helpers({
  editingTag: function (tag) {
    return Template.instance().editTag.get() == tag;    
  },
  setEditTag: function () {
    return Template.instance().setEditTag;    
  }
});
