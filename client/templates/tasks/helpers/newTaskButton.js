Template.newTaskButton.events({
	'click #new-task-button': function () {
		openModal('newTaskModalBody', 'newTaskModalFooter', true, {tags:this.tags.fetch()});
	}
});
