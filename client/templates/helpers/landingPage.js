Template.welcomeMessage.helpers({

	anyTags: function () {
		return this.tags.count();
	},
	anyCompleted: function () {
		return Completed.find().count();
	}

});
