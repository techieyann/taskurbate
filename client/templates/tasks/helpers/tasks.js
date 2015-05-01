Template.tasks.onRendered(function () {
	if (Session.equals('taskFilters', null)) {
		var filters = {};
		var tags = this.data.tags;
		for (var groupId in tags) {
			var groupTags = tags[groupId];
			var groupFilters = {
			default: 'view'
			};
			groupTags.forEach(function (tag) {
				groupFilters[tag._id] = 'view';
			});
			filters[groupId] = {
				group: 'view',
				tags: groupFilters
			};
		}
		Session.set('taskFilters', filters);
	}
	else {
		var filters = Session.get('taskFilters');
		for (var group in filters) {
			if (filters[group].group == 'hide') {
				$('.group-'+group).hide();
			}
		}
	}
});

Template.tasks.helpers({
	calendarViewAvailable: function () {
		if (this.anyDue && !Meteor.Device.isPhone()) return true;
	},
	tasksViewChecked: function (view) {
		return (Session.equals('tasksView', view) ? 'checked':'');
	},
	tasksView: function (view) {
		return Session.equals('tasksView', view)
	},
	searchingFor: function () {
		var search = Session.get('searchQuery');
		if (search) return search;
	}
});

Template.tasks.events({
	'click .search-tasks': function () {
		$('#nav-bar').slideUp(300);
		$('#search').val('');

		$('#nav-search').slideDown(300);
		$('#search').focus();
	},
	'click #searching-for': function () {
		$('#search').val(Session.get('searchQuery'));
		$('#nav-bar').slideUp(300);
		$('#nav-search').slideDown(300, function () {
			$('#search').focus();
		});

	},
	'click .clear-search': function () {
		Session.set('searchQuery', null);
	},
	'click .show-task-filters': function () {
		$('.show-task-filters').slideUp(300);
		$('.hide-task-filters, #task-filters').slideDown(300);
	},
	'click .hide-task-filters': function () {
		$('.show-task-filters').slideDown(300);
		$('#task-filters').slideUp(300);
	},
	'change #tasksView': function (e) {
		var view = 'list';
		if (e.target.checked) view = 'calendar';
		Session.set('tasksView', view);
	},
	'click .view-all': function () {
		var filters = Session.get('taskFilters');
		for (var group in filters) {
			filters[group].group = 'view';
			for (var tag in filters[group].tags) {
				filters[group].tags[tag] = 'view';
			}
			$('.group-'+group).slideDown(300);
		}
		Session.set('taskFilters', filters);
	}
});

Template.taskCollectionElement.helpers({
	groupById: function () {
		return 'group';
	},
	tagById: function () {
		return 'tag';
	},
	dueColor: function () {
		var longestTimeDiff = Template.parentData().longestTimeDiff;

		if (this.dueNext) {
			var diff = this.dueNext - Session.get('now');
			if (diff < 0) {
				return 'red';
			}
			if (diff < (longestTimeDiff / 5)) {
				return 'orange';
			}
			if (diff < (longestTimeDiff / 4)) {
				return 'amber';
			}
			if (diff < (longestTimeDiff / 3)) {
				return 'lime';
			}
			if (diff < (longestTimeDiff / 2)) {
				return 'lime';
			}
			if (diff < (longestTimeDiff/1.25)) {
				return 'green';
			}
			else {
				return 'teal';
			}
		} else {
			return 'black';
		}
	}
});

Template.taskCollectionElement.events({


});


