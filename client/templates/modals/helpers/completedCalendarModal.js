Template.completedCalendarModalBody.helpers({
	completed: function () {
		if (Meteor.user()) {
			return Completed.find({user: Meteor.user()._id, task: this._id}, {sort: {at: 1}});
		}
	},
	completedTaskSelected: function () {
		if (Session.equals('selectedCompletedTask', null)) return false;
		return true;
	},
	completedId: function () {
		return Session.get('selectedCompletedTask');
	},
	completedOn: function () {
		var completed = Completed.findOne({_id: Session.get('selectedCompletedTask')});
		if (completed) return completed.at.toLocaleDateString();
	},
	completedAt: function () {
		var completed = Completed.findOne({_id: Session.get('selectedCompletedTask')});
		if (completed) {
			var time = completed.at.toLocaleTimeString();
			if (time != '12:00:00 AM') return time;
		}
	},
	calendarOptions: function () {
		var task = this;
		return {
			id: 'calendar',
			header: {
				left: '',
				center: 'title',
				right: ''
			},
			defaultView: 'month',
			events: function (start, end, timezone, callback) {
				var completedArray = Completed.find({task: task._id}).fetch();
				var eventsArray = [];
				completedArray.forEach(function (completed) {
					var event = {
						start: completed.at,
						title: 'completed',
						id: completed._id
					};
					if (completed.at.toLocaleTimeString() == "12:00:00 AM") event.allDay = true;
					eventsArray.push(event);
				});
				callback(eventsArray);
			},
			eventClick: function (calEvent, jsEvent, view) {
				window.location.hash = '';
				Session.set('selectedCompletedTask', calEvent.id);
				window.location.hash = '#completed-row';
			}
		};
	}
});

Template.completedCalendarModalBody.events({
	'click .deselect-completed': function () {
		Session.set('selectedCompletedTask', null);
	},
	'click .remove-completed': function () {
		var completedId = Session.get('selectedCompletedTask');
		if (completedId) {
			Session.set('lastCompletedRemoved', Completed.findOne({_id: completedId}));
			Meteor.call('removeCompleted', completedId, function (err) {
				if (err) Materialize.toast('Remove completed error: '+err, 4000);
			});
			Materialize.toast('<span>Removed -- </span> <a href="#" onclick="undoRemoveCompleted()" class="yellow-text">Undo</a>', 4000);
			Session.set('selectedCompletedTask', null);
		}
	}
});
