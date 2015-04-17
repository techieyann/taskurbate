Template.taskMetaModalBody.helpers({
	dueData: function () {
		if (this.lastCompleted || this.schedulingType == "strict") return true;
		return false;
	},
	daysPlural: function () {
		if (this.dueEvery != 1) return 's';
	},
	completed: function () {
		if (Meteor.user()) {
			return Completed.find({user: Meteor.user()._id, task: this._id});
		}
	},
	completedOn: function () {
		return this.at.toLocaleDateString()+' '+this.at.toLocaleTimeString();
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
