var longestTimeDiff;

Template.tasks.helpers({
	anyTasks: function () {
		var furthestDue = Tasks.findOne({}, {sort: {dueNext:-1}});
		if (furthestDue) {
			longestTimeDiff = furthestDue.dueNext - Session.get('now');
		}		
		return (this.tasks ? true: false);
	},
	task: function () {
		return this.tasks;
	}
});

Template.taskCollectionElement.helpers({
	dueColor: function () {
		if (this.dueNext) {
			var diff = this.dueNext - Session.get('now');
			if (diff < 0) {
				return 'red';
			}
			if (diff < (longestTimeDiff / 5)) {
				return 'orange';
			}
			if (diff < (longestTimeDiff / 4)) {
				return 'amber';
			}
			if (diff < (longestTimeDiff / 3)) {
				return 'lime';
			}
			if (diff < (longestTimeDiff / 2)) {
				return 'green';
			}
			if (diff < (longestTimeDiff)) {
				return 'teal';
			}
			if (diff == longestTimeDiff) {
				return 'blue';
			}
		} else {
			return 'black';
		}
	}
});

Template.taskCollectionElement.events({


});


