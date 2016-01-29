const taskRoutes = FlowRouter.group({
  prefix: '/tasks',
  name: 'taskRoutes'
});

taskRoutes.route('/', {
  name: 'taskIndex',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'listTasksPage'
    });    
  }
});

taskRoutes.route('/new', {
  name: 'newTask',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'newTask'
    });    
  }
});

taskRoutes.route('/:taskId', {
  name: 'taskPage',
  action: () => {
    BlazeLayout.render('taskurbateLayout', {
      main: 'showTaskPage'
    });
  }
});

