Template.joinGroup.helpers({
  groupNames: () => {
    return Groups.find().fetch().map( (group) => {
      return {value: group.name, id: group._id};
    });
  },
  formError: () => {
    const instance = Template.instance();
    return instance.formError.get();
  }
});
