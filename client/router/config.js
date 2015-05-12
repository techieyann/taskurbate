Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'error404',
	loadingTemplate: 'loading',
	progressDelay: 100,
	progressSpinner: false
});

Router.onBeforeAction('loading');


