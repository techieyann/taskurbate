parseFormData = function (formData) {
	var parsedData = {};
	for(var i in formData) {
		parsedData[formData[i].name] = formData[i].value;
	}
	return parsedData;
};

today = function () {
	var current = new Date();
	return current.toLocaleDateString();
};

undoRemoveCompleted = function () {
	var lastRemoved = Session.get('lastCompletedRemoved');
	if (lastRemoved) {
		Meteor.call('undoRemoveCompleted', lastRemoved, function (err) {
			if (err) Materialize.toast('Undo error: '+err, 4000);
		});
		Materialize.toast('Remove completed undone.', 4000);
		Session.set('lastCompletedRemoved', '');
		Session.set('selectedCompletedTask', lastRemoved._id);
	}

};

undoCompleteTask = function () {
	var lastCompleted = Session.get('lastCompletedId');
	if (lastCompleted) {
		Meteor.call('removeCompleted', lastCompleted, function (err) {
			if (err) {
				Materialize.toast('Undo error: '+err, 4000);
				return;
			}
			Materialize.toast('Completed undone.', 4000);
		});

		Session.set('lastCompletedId', null);
	}
};

completeTask = function (id, duration, name, group) {
	var now = new Date();
	var options = {
		user: Meteor.user()._id,
		task: id,
		duration: duration,
		at: new Date(now.getTime() - (duration * 60 * 1000))
	};
	if (group != 'default') options.group = group;
	Meteor.call('completeTask', options, function (err, result) {
		if (err) {
			Materialize.toast('Complete task error: '+err, 4000);
			return;
		}
		Session.set('lastCompletedId', result);
		updateTaskMeta(id);
		Materialize.toast('Completed: "'+name+'" -- <a href="#" onclick="undoCompleteTask()" class="yellow-text">Undo</a>', 4000);
	});
};

deleteTask = function (id, name) {
	Meteor.call('deleteTask', id, function (err) {
		if (err) {
			Materialize.toast('Error: '+err, 5000);
		}
	});
	closeModal();
	Materialize.toast('Deleted: "'+name+'"', 3000);
};


completedTasks = function (groupId, userId) {
	var filters = {};
	if (groupId) {
		if (groupId == 'default') filters.group = {$exists: false};
		else filters.group = groupId;
	}
	if (userId) filters.user = userId;
	console.log(filters);
	var completed = Completed.find(filters, {fields: {task: 1, duration: 1, at: 1}});
	var taskArray = [];
	var taskCache = {};
	completed.forEach(function (done) {
		var cachedTask = taskCache[done.task];
		var taskName = '';
		var eventTitle = ''; 
		var taskDuration = done.duration;
		if (cachedTask) {
			taskName = cachedTask.name;
		} else {
			var currentTask = Tasks.findOne({_id: done.task});
			if (currentTask)	{
				cachedTask = {
					name: currentTask.name,
				};
				taskCache[done.task] = cachedTask;
				taskName = cachedTask.name;
			}
		}
		eventTitle = taskDuration+'m '+taskName;
		var displayDuration;
		if (taskDuration > 20) displayDuration = taskDuration;
		else displayDuration = 20;
		var endAt = new Date(done.at.getTime() + (displayDuration*60*1000));


		var calendarObject = {
			title: eventTitle,
			start: done.at,
			end: endAt,
			id: done.task,
			type: 'completed'
		};
		
	if (done.at.toLocaleTimeString() == '12:00:00 AM') {
		calendarObject.allDay = true;
	}
		taskArray.push(calendarObject);
	});
	return taskArray;
};
