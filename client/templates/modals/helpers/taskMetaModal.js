Template.taskMetaModalBody.helpers({
	dueData: function () {
		if (this.dueNext && this.dueEvery) return true;
		return false;
	},
	dueNextFormatted: function () {
		return this.dueNext.toLocaleDateString();
	},
	dueEveryFormatted: function () {
		return Math.round(this.dueEvery*100)/100;
	},
	daysPlural: function () {
		if (this.dueEvery != 1) return 's';
	},
	completed: function () {
		if (Meteor.user()) {
			return Completed.find({user: Meteor.user()._id, task: this._id}, {sort: {at: 1}});
		}
	},
	completedOn: function () {
		return this.at.toLocaleDateString();
	},
	completedAt: function () {
		var time = this.at.toLocaleTimeString();
		if (time != '12:00:00 AM') return time;
		return;
	}
});

Template.taskMetaModalBody.events({
	'click .remove-completed': function () {
		Session.set('lastCompletedRemoved', this);
		Meteor.call('removeCompleted', this._id, function (err) {
			if (err) Materialize.toast('Remove completed error: '+err, 4000);
		});
		Materialize.toast('<span>Removed.</span> <a href="#" onclick="undoRemoveCompleted()" class="btn-flat yellow-text">Undo</a>', 4000);

	}
});
