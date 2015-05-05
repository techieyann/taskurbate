Template.group.helpers({
	groupMember: function () {
		var memberArray = [];
		var members = this.group.members;
		var groupId = this.group._id;
		for (var key in members) {
			memberArray.push({
				name: members[key],
				groupMemberPath: '/groups/'+groupId+'/member/'+key
			});
		}
		return memberArray;
	}
});

Template.group.events({
	'click #hide-tasks': function () {
		$('#hide-tasks').hide();
		$('#show-tasks').show();
		$('#group-tasks').slideUp(300);
	},
	'click #show-tasks': function () {
		$('#show-tasks').hide();
		$('#hide-tasks').show();
		$('#group-tasks').slideDown(300);
	}
});
