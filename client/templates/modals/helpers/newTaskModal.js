Template.newTaskModalBody.onRendered(function () {
	$('select').material_select();
	$('#days-before-due-input').hide();
});

Template.newTaskModalBody.helpers({
	disabledWithoutTags: function () {
		if (!this.tag) return 'disabled';
	}
});
Template.newTaskModalBody.events({
	'click #strict': function () {
		$('#adaptive-scheduling-explanation').slideUp(300, function () {
			$('#days-before-due-input').slideDown(300);
		});
	},
	'click #adaptive': function () {
		$('#days-before-due-input').slideUp(300, function () {
			$('#adaptive-scheduling-explanation').slideDown(300);
		});
	}
});
Template.newTaskModalFooter.events({
	'click .create-task': function () {
		
		closeModal();
	}
});
