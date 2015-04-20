Template.groups.helpers({
	hasNickname: function () {
		if (Meteor.user()) {
			var profile = Meteor.user().profile;
			if (profile.nickname) return true;
		}
	}
});
