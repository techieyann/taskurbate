Template.backdateTaskModalBody.onRendered(function () {
	$('#backdate-datepicker').datepicker({maxDate: 0});
});

Template.backdateTaskModalFooter.events({
	'click .backdate-task': function () {
		var backdate = $('#backdate-datepicker').val();
		if (!backdate) {
			Materialize.toast('Date required for backdating...', 4000);
			$('#backdate-datepicker').focus();
			return;
		} else {
			var options = {
				user: Meteor.user()._id,
				task: this._id,
				at: new Date(backdate)
			};
			Meteor.call('completeTask', options, function (err) {
				if (err) Materialize.toast('Complete task error: '+err);
			});
			Materialize.toast('Backdated task: "'+this.name+'"', 4000);
			closeModal();
		}
	}
});
