Template.displayTag.helpers({
  'disabled': (tag) => {
    return (tag.numTasks() == 0) && 'disabled';
  },
  'numTasks': (tag) => {
    return tag.numTasks();
  },
  'editable': (tag) => {
    const admin = Template.instance().data.admin;
    return (admin && tag.name!='Misc.');
  },
  'editData': () => {
    const instance = Template.instance();
    return {
      tag: instance.data.tag,
      setEdit: instance.data.setEdit
    };
  }
});
