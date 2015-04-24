Template.taskFilters.helpers({
	selfTag: function () {
		return this.tags['default'];
	},
	groupTag: function () {
		return Template.parentData().tags[this._id];
	},
	groupChecked: function (groupId) {
		var filters = Session.get('taskFilters');
		if (filters) {
			if (filters[groupId].group == 'view') return 'checked';
		}
	},
	tagChecked: function (groupId, tagId) {
		var filters = Session.get('taskFilters');
		if (filters) {
			if (filters[groupId].tags[tagId] == 'view') return 'checked';
		}
	},
	defaultTasks: function (groupId) {
		return Tasks.find({$and: [{group:groupId},{tag:'default'}]}).count();
	},
	groupTasks: function (groupId) {
		return Tasks.find({group:groupId}).count();
	}
});

Template.taskFilters.events({
	'change .task-filter': function (e) {
		var checked = e.target.checked;
		var type = e.target.dataset.type;
		var group = e.target.dataset.group;
		var filters = Session.get('taskFilters');
		if (type == 'group') {
			if (checked) {
				$('.group-'+group).slideDown(300);
			} else {
				$('.group-'+group).slideUp(300);
			}
			filters[group].group = (checked ? 'view':'hide');
		} else if (type == 'tag') {
			var tag = e.target.dataset.tag;
			filters[group].tags[tag] = (checked ? 'view':'hide');
		}
		Session.set('taskFilters', filters);
	}
});
