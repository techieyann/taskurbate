Template.newTaskButton.events({
	'click #new-task-button': function () {
		openModal('newTaskModalBody', 'newTaskModalFooter', {tags:this.tags.fetch()});
	}
});
