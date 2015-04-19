Template.layout.events = {
	'click .logout': function () {
		Meteor.logout();
	},
	'click .close-modal': function () {
		closeModal();
	}
};
