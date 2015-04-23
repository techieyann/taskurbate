Template.group.helpers({
	anyTasks: function () {
		return this.tasks.count();
	},
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

