Template.joinGroup.onRendered(function () {
  Meteor.typeahead.inject();
  this.autorun(redirectToGroup);
});
