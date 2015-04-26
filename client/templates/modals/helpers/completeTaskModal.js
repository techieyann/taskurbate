Template.completeTaskModalFooter.events({
	'click .complete-task-modal': function () {
		var duration = parseInt($('#duration').val());
		console.log(duration);
		if (!duration) {
			Materialize.toast('Task duration must be a positive number', 4000);
			$('#duration').val('').focus();
			return;
		}
		if (duration <= 0) {
			Materialize.toast('Task duration must be positive', 4000);
			$('#duration').val('').focus();
			return;		
		}
		
		completeTask(this._id, duration, this.name);
		closeModal();
	}
});
