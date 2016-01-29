AccountsTemplates.configure({
  defaultTemplate: 'fullPageAtForm',
  defaultLayout: 'taskurbateLayout',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main',
  continuousValidation: true,
  positiveValidation: true,
  negativeValidation: true,
  negativeFeedback: true,
  positiveFeedback: true,
  showValidating: true,
  texts: {
    errors: {
      loginForbidden: 'Incorrect email/password combo'
    }
  },
  homeRoutePath: '/group',
  onLogoutHook: function () {
    FlowRouter.go('/');
  },
  postSignUpHook: function (userId, info) {
    Meteor.users.update(userId, {$set: {name: info.email}});
  }
});

AccountsTemplates.configureRoute('signIn');

AccountsTemplates.configureRoute('signUp');
