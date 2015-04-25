Template.tasksByTag.helpers({
	anyTaskOrTag: function () {
		return (this.anyTasks + this.tags.count());
	},
	anyTaggedTasks: function (tagId) {
		var data = Template.parentData();
		if (tagId == 'default') data = this;
		if(data.tasksByTag[tagId]) {
			return data.tasksByTag[tagId].length;
		}
	},
	taggedTask: function (tagId) {
		if (tagId == 'default') return this.tasksByTag[tagId];
		else return Template.parentData().tasksByTag[tagId];
	}
});

Template.tasksByTag.events({
	'click .hide-tasks': function (e) {
		var tagId = e.target.dataset.tag; 
		$('#hide-tasks-'+tagId).hide();
		$('#show-tasks-'+tagId).show();
		$('#'+tagId+'-ul>li:gt(0)').slideUp(300);
	},
	'click .show-tasks': function (e) {
		var tagId = e.target.dataset.tag; 
		$('#show-tasks-'+tagId).hide();
		$('#hide-tasks-'+tagId).show();
		$('#'+tagId+'-ul > li:gt(0)').slideDown(300);
	},
	'click .edit-tag': function () {
		var id = this._id;
		var selector = '#'+id;
		$(selector+'-display').hide();
		$(selector+'-edit').show();
		$('#edit-tag-'+id).focus();
	},
	'click .submit-edit-tag-form, submit .edit-tag-form': function (e) {
		e.preventDefault();
		processEditTagForm(this._id, Template.parentData().selectedGroup._id);
	},
	'click .delete-tag': function () {
		if (this.tasks != 0) {
			openModal('deleteTagModalBody','deleteTagModalFooter', false, this);
		}
		else deleteTag(this._id, this.name);
	}
});

var processEditTagForm = function (tagId, groupId) {
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
		if (Tags.findOne({_id:{$ne: tagId}, name: tagEdit, group: groupId})) {
			Materialize.toast('Tag: "'+tagEdit +'" already exists...', 3000);
			editTagInput.val('').focus();
			return;
		}
		if (Tags.findOne({name: tagEdit, group: groupId})) {
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


deleteTag = function (id, name) {
	Meteor.call('deleteTag', id, function (err) {
		if (err) {
			Materialize.toast('Error: '+err, 5000);
		}
	});
	Materialize.toast('Deleted tag: "'+name+'"', 3000);
	closeModal();
};
