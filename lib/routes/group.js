const groupRoutes = FlowRouter.group({
  prefix: '/group',
  name: 'groupRoutes'
});

groupRoutes.route('/', {
  name: 'groupIndex',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'groupLandingPage'
    });
  }
});

groupRoutes.route('/join', {
  name: 'joinGroup',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'joinGroup'
    });
  }
});

groupRoutes.route('/create', {
  name: 'newGroup',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'newGroup'
    });
  }
});

groupRoutes.route('/:groupId', {
  name: 'groupPage',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'groupPage'
    });    
  }
});
