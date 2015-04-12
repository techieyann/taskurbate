Template.deleteTagModalFooter.events({
	'click .delete-tag': function () {
		deleteTag(this._id, this.name);
	}
});
