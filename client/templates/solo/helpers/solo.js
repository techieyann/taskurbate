Template.solo.events({
	'click #hide-tasks': function () {
		$('#hide-tasks').hide();
		$('#show-tasks').show();
		$('#solo-tasks').slideUp(300);
	},
	'click #show-tasks': function () {
		$('#show-tasks').hide();
		$('#hide-tasks').show();
		$('#solo-tasks').slideDown(300);
	}
});
