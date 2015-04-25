Template.notifications.helpers({
	anyNotifications: function () {
		var numNotifications = this.overdueTasks.length + this.dueTodayTasks.length + this.notifications.length;
		return numNotifications;
	},
	completedNotification: function () {
		return (this.type == 'completed');
	},
	formattedDatetime: function(date) {
		var dateString = date.toLocaleDateString();
		var timeString = date.toLocaleTimeString();
		if (timeString != '12:00:00 AM') return dateString + ' at ' + timeString;
		return dateString;
	}
});

Template.notifications.events({
	'click .close-notification': function () {
		Meteor.call('removeNotification', this._id, function (err) {
			if (err) Materialize.toast('Remove notification '+err, 4000);
		})
	}
});
