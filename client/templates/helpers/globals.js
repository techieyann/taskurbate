Template.layout.events = {
	'click .logout': function () {
		Meteor.logout();
	},
	'click .close-modal': function () {
		closeModal();
	},
	'click .complete-task': function () {
		completeTask(this._id, this.name);
		closeModal();
	},

	'click .backdate-task': function () {
		openModal('backdateTaskModalBody','backdateTaskModalFooter', false, this);
	},
	'click .submit-backdate-task': function () {
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
	}
};

Template.registerHelper('dueNextFormatted', function () {
	return this.dueNext.toLocaleDateString();
});

Template.registerHelper('completedToday', function () {
	if (this.lastCompleted) {
		if (this.lastCompleted.toLocaleDateString() == today()) return true;
	}
	return false;
});
