Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'error404',
	loadingTemplate: 'loading',
	waitOn: function () {
		var userId = '';
			var groups = [];
		if (Meteor.user()) {
			var userId = Meteor.user()._id;
			var groups = Meteor.user().profile.groups;


		}
			return [
				Meteor.subscribe('notifications', userId),
				Meteor.subscribe('groups', groups),
				Meteor.subscribe('tasks', userId, groups),
				Meteor.subscribe('tags', userId, groups),
				Meteor.subscribe('completed', userId, groups),
			];
	}
});

Router.onBeforeAction('loading');


