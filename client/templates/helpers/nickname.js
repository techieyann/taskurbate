Template.nicknameForm.helpers({
	nickname: function () {
		var profile = Meteor.user().profile;
		if (profile) {
			return profile.nickname;
		}
	}
});

Template.nicknameForm.events({
	'submit #nickname-form, click #submit-nickname': function (e) {
		e.preventDefault();
		var nickname = $('#nickname').val();
		if (nickname) {
			Meteor.call('setNickname', nickname, function (err) {
				if (err) Materialize.toast('Set nickname error: '+err,4000);
			}); 
			Materialize.toast('Set nickname: "'+nickname+'"',4000);
		} else {
			Materialize.toast('Please enter a nickname...',4000);
			$('#nickname').focus();
		}
	}
});
