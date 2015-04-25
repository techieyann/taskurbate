Template.newTagOrTaskButton.events({
	'click #new-task-button': function () {
		var group = Template.parentData().selectedGroup;
		var tagsByGroup = {};
		tagsByGroup[group._id] =Template.parentData().tags.fetch();
		Session.set('selectedGroup', group._id);
		var data = {
			groups: [group],
			tags: tagsByGroup,
			groupSelectDisabled: true
		};
		openModal('newTaskModalBody', 'newTaskModalFooter', true, data);		
	},
	'click #new-tag-button': function () {
		var data = {
			group: Template.parentData().selectedGroup._id
		};
		openModal('newTagModalBody', 'newTagModalFooter', false, data);
	}
});
