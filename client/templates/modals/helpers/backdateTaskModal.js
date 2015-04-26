Template.backdateTaskModalBody.onRendered(function () {
	$('#backdate-datepicker').datepicker({maxDate: 0});
});

Template.backdateTaskModalFooter.events({
	'click .submit-backdate-task': function () {
		var backdate = $('#backdate-datepicker').val();
		if (!backdate) {
			Materialize.toast('Date required for backdating...', 4000);
			$('#backdate-datepicker').focus();
			return;
		}
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
		var options = {
			user: Meteor.user()._id,
			task: this._id,
			duration: duration,
			at: new Date(backdate)
		};
		var name = this.name;
		var id = this._id;
		Meteor.call('completeTask', options, function (err, result) {
			if (err) {
				Materialize.toast('Complete task error: '+err);
				return;
			}
			Session.set('lastCompletedId', result);
			updateTaskMeta(id);
			Materialize.toast('<span>Backdated task: "'+name+'"</span> <a href="#" onclick="undoCompleteTask()" class="btn-flat yellow-text">Undo</a>', 4000);
			closeModal();
		});



	}
});
