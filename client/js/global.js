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
