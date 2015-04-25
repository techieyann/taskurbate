Template.groups.helpers({
	hasNickname: function () {
		if (Meteor.user()) {
			var profile = Meteor.user().profile;
			if (profile.nickname) return true;
		}
	},
	anyGroups: function () {
		var groups = Meteor.user().profile.groups;
		if (groups) {
			if (groups.length) return true;
		}
		return false;
	}
});

Template.groupList.helpers({
	group: function () {
		return this.groups;
	}
});

Template.groups.events({
	'click .leave-group': function () {
		openModal('leaveGroupModalBody', 'leaveGroupModalFooter', false, null);
	}
});
