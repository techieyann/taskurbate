Template.navbar.onRendered(function () {
	$(".button-collapse").sideNav({
		menuWidth: 175,
		edge: 'right',
		closeOnClick: true
	});
	$(".dropdown-button").dropdown({hover:false});
});

Template.navbar.helpers({
	activeRoute: function (route) {
		return (Router.current().route.getName() == route ? 'active':'');
	},
	initDropdown: function () {
		$(".dropdown-button").dropdown({hover:false});
	}
});
