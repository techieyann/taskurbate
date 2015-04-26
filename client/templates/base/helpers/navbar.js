Template.navbar.onRendered(function () {
	$('.button-collapse').sideNav({
		menuWidth: 175,
		edge: 'right',
		closeOnClick: true
	});
	$('.dropdown-button').dropdown({hover:false});
	$('#search').on('blur', function () {
		$('#nav-search').slideUp(300);
		$('#nav-bar').slideDown(300);

	});
});

Template.navbar.helpers({
	activeRoute: function (route) {
		return (Router.current().route.getName() == route ? 'active':'');
	},
	initDropdown: function () {
		$('.dropdown-button').dropdown({hover:false});
	}
});

Template.navbar.events({
	'submit #search-form': function (e) {
		e.preventDefault();
		var searchFor = $('#search').val();
		if (searchFor) Session.set('searchQuery', searchFor); 
		$('#search').blur();
	},
	'keyup #search': function (e) {
		if(Meteor.Device.isDesktop()) Session.set('searchQuery', $('#search').val()); 		
	}
});
