Template.addGroupModalBody.events({
	'click #swap-to-join': function () {
		$('#create-header, #create-group').hide();
		$('#join-header, #join-group').show();
		$('#confirm-password').slideUp(300);
	},
	'click #swap-to-create': function () {
		$('#join-header, #join-group').hide();
		$('#create-header, #create-group').show();
		$('#confirm-password').slideDown(300);
	},
	'click #join-group': function () {
		joinGroup();
	},
	'click #create-group': function () {
		createGroup();
	}
});


var joinGroup = function () {
	var formData = $('#group-form').serializeArray();
	var parsedData = parseFormData(formData);
	if (parsedData.groupName == '') {
		Materialize.toast('Group must have a name.',3000);
		$('#group-name').focus();
		return;
	}
	if (parsedData.groupPass == '') {
		Materialize.toast('Group must have a password.',3000);
		$('#group-pass').focus();
		return;
	}
	var options = {
		name: parsedData.groupName,
		password: parsedData.groupPass,
	};
	Meteor.call('joinGroup', options, function (err) {
		if (err) {
			Materialize.toast('Join group '+err, 4000);
			return;
		}
		Materialize.toast('Joined group: '+parsedData.groupName, 4000);
		closeModal();
	});
};

var createGroup = function () {
	var formData = $('#group-form').serializeArray();
	var parsedData = parseFormData(formData);
	if (parsedData.groupName == '') {
		Materialize.toast('Group must have a name.',3000);
		$('#group-name').focus();
		return;
	}
	if (parsedData.groupName == 'Self') {
		Materialize.toast('Group: "Self" already exists...',3000);
		$('#group-name').val('').focus();
		return;
	}
	if (Groups.findOne({name: parsedData.groupName})) {
			Materialize.toast('Group: "'+parsedData.groupName +'" already exists...', 3000);
			$('#group-name').val('').focus();
			return;
	}
	if (parsedData.groupPass == '') {
		Materialize.toast('Group must have a password.',3000);
		$('#group-pass').focus();
		return;
	}
	if (parsedData.groupPass != parsedData.groupPassConfirm) {
		Materialize.toast('Passwords do not match.',3000);
		$('#group-pass-confirm').val('').focus();
		return;
	}
	var options = {
		name: parsedData.groupName,
		password: parsedData.groupPass,
		creator: Meteor.user()._id,
		members: {}
	};
	Meteor.call('newGroup', options, function (err) {
		if (err) {
			Materialize.toast('Create group '+err, 4000);
			return;
		}
		var group = {
			name: options.name,
			password: options.password
		};
		Meteor.call('joinGroup', group, function (err) {
			if (err) {
				Materialize.toast('Join group '+err, 4000);
				return;
			}
			Materialize.toast('Created group: '+parsedData.groupName, 4000);
			closeModal();
		});
	});
};
