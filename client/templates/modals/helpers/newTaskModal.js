Template.newTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#due-starting').datepicker({minDate:0});
	$('#strict-inputs').hide();
});

Template.newTaskModalBody.helpers({
	disabledWithoutTags: function () {
		if (!this.tags.length) return 'disabled';
	},
	tag: function () {
		return this.tags;
	}
});
Template.newTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-scheduling-explanation').slideUp(300);
		$('#strict-inputs').slideDown(300);
	},
	'click #adaptive': function () {
		$('#strict-inputs').slideUp(300);
		$('#adaptive-scheduling-explanation').slideDown(300);
	}
});
Template.newTaskModalFooter.events({
	'click .create-task': function () {
		
		closeModal();
	}
});
