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
	'click .show-only': function (e) {
		var type = e.currentTarget.dataset.type;
		var filterId = e.currentTarget.dataset.id;
		var filters = Session.get('taskFilters');
		if (type == 'group') {
			for (var id in filters) {
				if (id == filterId) {
					filters[id].group = 'view';
					$('.group-'+id).slideDown(300);
				}
				else {
					filters[id].group = 'hide';
					$('.group-'+id).slideUp(300);					
				}
			}			
		}

		if (type == 'tag') {
			var group = e.currentTarget.dataset.group;
			for (var id in filters) {
				if (id == group) {
					filters[id].group = 'view';
					$('.group-'+id).slideDown(300);
				}
				else {
					filters[id].group = 'hide';
					$('.group-'+id).slideUp(300);					
				}
			}			
			for (var id in filters[group].tags) {
				if (id == filterId) filters[group].tags[id] = 'view';
				else filters[group].tags[id] = 'hide';
			}
		}
		Session.set('taskFilters', filters);

	},
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
