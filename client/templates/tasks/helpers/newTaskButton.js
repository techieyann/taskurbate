Template.newTaskButton.events({
	'click #new-task-button': function () {
		var data = {
			groups: this.groups,
			tags: this.tags
		};
		openModal('newTaskModalBody', 'newTaskModalFooter', true, data);
	}
});
