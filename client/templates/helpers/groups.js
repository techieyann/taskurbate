Template.groups.helpers({
	hasNickname: function () {
		if (Meteor.user()) {
			var profile = Meteor.user().profile;
			if (profile.nickname) return true;
		}
	},
	anyGroups: function () {
		var groups = Meteor.user().profile.groups;
		if (groups) {
			if (groups.length) return true;
		}
		return false;
	}
});

Template.groupList.helpers({
	group: function () {
		return this.groups;
	}
});



Template.groupJoinCreate.events({
	'click #join-group': function () {
		joinGroup();
	},
	'click #create-group': function () {
		createGroup();
	},
	'click #swap-to-join': function () {
		$('#create-control').hide();
		$('#join-control').show();
		$('#confirm-password').slideUp(300);
	},
	'click #swap-to-create': function () {
		$('#join-control').hide();
		$('#create-control').show();
		$('#confirm-password').slideDown(300);
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
			Materialize.toast('Join group error: '+err, 4000);
			return;
		}
		Materialize.toast('Joined group: '+parsedData.groupName, 4000);
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
	if (Groups.find({name: parsedData.groupName}).count()) {
		Materialize.toast('Group name '+parsedData.groupName+' already exists.',3000);
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
			Materialize.toast('Create group error: '+err, 4000);
			return;
		}
		var group = {
			name: options.name,
			password: options.password
		};
		Meteor.call('joinGroup', group, function (err) {
			if (err) {
				Materialize.toast('Join group error: '+err, 4000);
				return;
			}
			Materialize.toast('Created group: '+parsedData.groupName, 4000);
		});
	});
};
