Template.layout.events = {
	'click .logout': function () {
		Meteor.logout();
	},
	'click .close-modal': function () {
		closeModal();
	}
};

Template.registerHelper('tagByID', function () {
	var tagID = this.tag;
	if (tagID == 0) {
		return 'Misc.';
	}
	else {
		return Tags.findOne({_id: tagID}).name;
	}
});
