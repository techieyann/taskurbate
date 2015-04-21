Template.completeTaskModalBody.onRendered(function () {
	$('#backdate-datepicker').datepicker({maxDate: 0});
});

Template.completeTaskModalBody.events({
	'click .backdate-task-show': function () {
		$('.backdate-task-show, .complete-task').hide();
		$('.backdate-task-hide, .submit-backdate-task').show();
		$('#backdate-row').slideDown(300);
	},
	'click .backdate-task-hide': function () {
		$('.backdate-task-hide, .submit-backdate-task').hide();
		$('.backdate-task-show, .complete-task').show();
		$('#backdate-row').slideUp(300);
	}
});
