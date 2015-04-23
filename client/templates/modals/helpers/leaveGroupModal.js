Template.leaveGroupModalFooter.events({
	'click .leave-group': function () {
		Meteor.call('leaveGroup', this._id, function (err) {
			if (err) Materialize.toast('Leave group '+err, 4000);
		});
		Materialize.toast('Left group: '+this.name, 4000);
		closeModal();
	}
});
