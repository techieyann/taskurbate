Template.modal.helpers({
	modalBody: function () {
		return Session.get("modal-body");
	},
	modalFooter: function () {
		return Session.get("modal-footer");
	},
	modalData: function () {
		return Session.get("modal-data");
	}
});

openModal = function (body, footer, data) {
	if (body) Session.set("modal-body", body);
	if (footer) Session.set("modal-footer", footer);
	if (data) Session.set("modal-data", data);
	$('#modal').openModal({
		dismissable: true,
		opacity: .5,
		in_duration: 300,
		out_duration: 200,
//		ready: function (){console.log('opened modal');},
		complete: function (){
			Session.set("modal-body", '');
			Session.set("modal-footer", '');
			Session.set("modal-data", '');
		}
	});
};

closeModal = function () {
	$('#modal').closeModal();
	Session.set("modal-body", '');
	Session.set("modal-footer", '');
	Session.set("modal-data", '');
};
