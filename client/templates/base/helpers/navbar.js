Template.navbar.onRendered(function () {
	$(".button-collapse").sideNav({
		menuWidth: 300,
		edge: 'right',
		closeOnClick: true
	});
});

Template.navbar.helpers({
	activeRoute: function (route) {
		return (Router.current().route.getName() == route ? 'active':'');
	}
});
