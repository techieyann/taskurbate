Template.list.onRendered(function () {
	$('#list-tasks-per-page-select').material_select();
});

Template.list.helpers({
	tasksInPage: function () {
		var currentPage = Session.get('tasksPage');
		var numPerPage = Session.get('tasksPerPage');
		var start = (currentPage-1)*numPerPage;
		if (start > this.tasks.length) {
			Session.set('tasksPage', 1);
			currentPage = 1;
			start = 0;
		}
		var end = (currentPage-1)*numPerPage + numPerPage;
		if (end > this.tasks.length) end = this.tasks.length;
	
		return this.tasks.slice(start, end);
	},
	moreThanOnePage: function () {
		var numPerPage = Session.get('tasksPerPage');
		return (this.anyTasks > numPerPage ? true: false);
	},
	page: function () {
		var pages = [];
		var numPerPage = Session.get('tasksPerPage');
		var numPages = Math.ceil(this.anyTasks / numPerPage);
		for (var i=0; i<numPages; i++) {
			pages.push({
				num: i+1
			});
		}
		return pages;
	},
	activePage: function () {
		var currentPage = Session.get('tasksPage');
		return (currentPage == this.num ? 'active': '');
	},
	firstPage: function () {
		var currentPage = Session.get('tasksPage');
		return (currentPage == 1 ? 'disabled': '');
	},
	lastPage: function () {
		var numPerPage = Session.get('tasksPerPage');
		var numPages = Math.ceil(this.anyTasks / numPerPage);
		var currentPage = Session.get('tasksPage');
		return (currentPage == numPages ? 'disabled': '');
	},
	prevPage: function () {
		var currentPage = Session.get('tasksPage');
		return (currentPage == 1 ? 1: currentPage-1);
	},
	nextPage: function () {
		var numPerPage = Session.get('tasksPerPage');
		var numPages = Math.ceil(this.anyTasks / numPerPage);
		var currentPage = Session.get('tasksPage');
		return (currentPage == numPages ? currentPage: currentPage+1);		
	},
	tasksPerPage: function (numTasks) {
		return (Session.equals('tasksPerPage', parseInt(numTasks)) ? 'selected':'');
	}
});

Template.list.events({
	'click .page-changer': function (e) {
		var newPage = parseInt(e.currentTarget.dataset.page);
		if (!newPage) newPage = 1;
		Session.set('tasksPage', newPage);
	},
	'change select': function (e) {
		Session.set('tasksPerPage', parseInt(e.target.value));
	}
});
