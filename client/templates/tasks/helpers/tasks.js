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

var longestTimeDiff;

Template.tasks.helpers({
	anyTasks: function () {
		var furthestDue = Tasks.findOne({}, {sort: {dueNext:-1}});
		if (furthestDue) {
			longestTimeDiff = furthestDue.dueNext - Session.get('now');
		}		
		return (this.anyTasks ? true: false);
	},
	task: function () {
		return this.tasks;
	}
});

Template.tasks.events({
	'click .show-task-filters': function () {
		$('.show-task-filters').slideUp(300);
		$('.hide-task-filters, #task-filters').slideDown(300);
	},
	'click .hide-task-filters': function () {
		$('.show-task-filters').slideDown(300);
		$('#task-filters').slideUp(300);
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


