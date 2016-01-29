Template.joinGroup.events({
  'submit #join-group-form': function (e) {
    const instance = Template.instance();
    instance.formError.set('');
    e.preventDefault();
    const joinGroup = {
      name: $('#group-name').val(),
      accessCode: $('#group-code').val()
    };
    if (!joinGroup.name) {
      instance.formError.set('Name required');
      $('#group-name').focus();
      return;
    }
    if (!joinGroup.accessCode) {
      instance.formError.set('Access code required');
      $('#group-code').focus();
      return;
    }
    Groups.methods.joinGroup.call(joinGroup, (err, result) => {
      if (err) {
        instance.formError.set(err.details);
        if (err.error == 'Groups.methods.joinGroup.unknownGroup')
          $('#group-name').val('').focus();
        if (err.error == 'Groups.methods.joinGroup.badCode')
          $('#group-code').val('').focus();
      }
      else {
        FlowRouter.go('groupPage', {groupId: result});
      }
    });
  }
});
