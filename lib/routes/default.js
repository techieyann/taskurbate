FlowRouter.route('/', {
  name: 'index',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'landingPage'
    });
  }
});

FlowRouter.route('/sign-out', {
  name: 'signOut',
  action: () => {
    AccountsTemplates.logout();
  }
});
