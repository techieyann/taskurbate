const calendarRoutes = FlowRouter.group({
  prefix: '/calendar',
  name: 'calendarRoutes'
});

calendarRoutes.route('/', {
  name: 'calendarIndex',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'calendarLandingPage'
    });
  }
});
