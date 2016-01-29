Template.taskurbateLayout.helpers({
  modalHelper: () => {
    return Session.get('modalTemplate');
  },
  dataHelper: () => {
    return Session.get('modalData');
  }
});
