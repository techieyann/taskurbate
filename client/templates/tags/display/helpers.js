Template.displayTag.helpers({
  'numTasks': (tag) => {
    return tag.numTasks();
  },
  'editable': (tag) => {
    const admin = Template.instance().data.admin;
    return (admin && tag.name!='Misc.');
  }
});
