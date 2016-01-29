Template.afInput_typeahead.helpers({
  groupNames: () => {
    return Groups.find().fetch().map( (group) => {
      return group.name;
    });
  }
});
