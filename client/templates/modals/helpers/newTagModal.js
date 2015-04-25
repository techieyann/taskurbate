Template.newTagModalFooter.events({
	'click .create-tag, submit #new-tag-form': function (e) {
		e.preventDefault();
		processNewTagForm(this.group);
	}
});

var processNewTagForm = function (group) {
	var newTag = $('#new-tag').val();
	if (!newTag) {
		Materialize.toast('A tag needs a name...', 3000);
		$('#new-tag').focus();
	}
	else {
		check(newTag, String);
		if(newTag.length > 20) {
			Materialize.toast('Tag must be less than 20 characters...', 3000);
			editTagInput.focus();
			return
		}
		if (newTag == 'Misc.') {
			Materialize.toast('Tag: "Misc." already exists...', 3000);
			$('#new-tag').val('').focus();
			return;
		}
		if (Tags.findOne({$and: [{group: group},{name: newTag}]})) {
			Materialize.toast('Tag: "'+newTag +'" already exists...', 3000);
			$('#new-tag').val('').focus();
			return;
		}
		var options = {
			name: newTag,
			user: Meteor.user()._id,
			group: group,
			tasks: 0
		};
		Meteor.call('newTag', options, function (err) {
			if (err) {
				Materialize.toast('Error: '+err, 5000);
			}
		});
		Materialize.toast('Created tag: "'+newTag+'"', 3000);
		closeModal();
	}
};
