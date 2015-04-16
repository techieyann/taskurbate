Template.deleteTaskModalFooter.events({
	'click .delete-task': function () {
		deleteTask(this._id, this.name);
	}
});
