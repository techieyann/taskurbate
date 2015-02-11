Template.breadcrumbs.helpers({
	'isNotCurrentPath': function () {
		return this.url != Router.current().location.get().path;
	}
});
