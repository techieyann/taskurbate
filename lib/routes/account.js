const accountRoutes = FlowRouter.group({
  prefix: '/account',
  name: 'accountRoutes'
});

accountRoutes.route('/', {
  name: 'accountIndex',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'accountLandingPage'
    });
  }
});
