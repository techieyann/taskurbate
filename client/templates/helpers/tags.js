Template.tags.onRendered(function () {
	$('#new-tag').focus();
});

Template.tags.helpers({
	anyTags: function () {
		return (this.tags?true:false);
	},
	tag: function () {
		return this.tags;
	}
});
Template.tags.events({
	'click .create-tag, submit #new-tag-form': function (e) {
		e.preventDefault();
		processNewTagForm();
	}
});
Template.tagCollectionElement.events({
	'dblclick .tag, click .edit-tag': function () {
		var id = this._id;
		var selector = '#'+id;
		$(selector+'-display').hide();
		$(selector+'-edit').show();
		$('#edit-tag-'+id).focus();
	},
	'click .submit-edit-tag-form, submit .edit-tag-form': function (e) {
		e.preventDefault();
		processEditTagForm(this._id);
	},
	'click .delete-tag': function () {
		if (this.tasks != 0) {
			openModal('deleteTagModalBody','deleteTagModalFooter', false, this);
		}
		else deleteTag(this._id, this.name);
	}
});

deleteTag = function (id, name) {
	Meteor.call('deleteTag', id, function (err) {
		if (err) {
			Materialize.toast('Error: '+err, 5000);
		}
	});
	Materialize.toast('Deleted tag: "'+name+'"', 3000);
};

var processNewTagForm = function () {
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
		if (Tags.findOne({name: newTag})) {
			Materialize.toast('Tag: "'+newTag +'" already exists...', 3000);
			$('#new-tag').val('').focus();
			return;
		}
		var options = {
			name: newTag,
			user: Meteor.user()._id,
			tasks: 0
		};
		Meteor.call('newTag', options, function (err) {
			if (err) {
				Materialize.toast('Error: '+err, 5000);
			}
		});
		Materialize.toast('Created tag: "'+newTag+'"', 3000);
		$('#new-tag').val('').focus();
	}
};

var processEditTagForm = function (tagId) {
	var editTagInput = $('#edit-tag-'+tagId);
	var tagEdit = editTagInput.val();
	if (!tagEdit) {
		Materialize.toast('A tag needs a name...', 3000);
		editTagInput.focus();
	}
	else {
		check(tagEdit, String);
		if(tagEdit.length > 20) {
			Materialize.toast('Tag must be less than 20 characters...', 3000);
			editTagInput.focus();
			return
		}
		if (Tags.findOne({_id:{$ne: tagId}, name: tagEdit})) {
			Materialize.toast('Tag: "'+tagEdit +'" already exists...', 3000);
			editTagInput.val('').focus();
			return;
		}
		if (Tags.findOne({name: tagEdit})) {
			var selector = '#'+tagId;
			$(selector+'-edit').slideUp(300);
			$(selector+'-display').slideDown(300);
			return;
		}
		var options = {
			name: tagEdit,
			id: tagId
		};
		Meteor.call('editTag', options, function (err) {
			if (err) {
				Materialize.toast('Error: '+err, 5000);
			}
		});
		Materialize.toast('Changed tag to: "'+tagEdit+'"', 3000);
		var selector = '#'+tagId;
		$(selector+'-edit').slideUp(300);
		$(selector+'-display').slideDown(300);
	}
};
