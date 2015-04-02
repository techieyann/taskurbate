Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'error404',
	loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');
