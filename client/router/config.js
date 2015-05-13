Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'error404',
	loadingTemplate: 'loading',
	progressSpinner: false
});

Router.onBeforeAction('loading');


