openModal = (template, data) => {
  Session.set('modalData', data);
  Session.set('modalTemplate', template);
  $('#modal').modal('show');
};
