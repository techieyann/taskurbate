Template.notifications.helpers({
	anyNotifications: function () {
		var numNotifications = this.overdueTasks.length + this.dueTodayTasks.length + this.notifications.length;
		return numNotifications;
	}
});
