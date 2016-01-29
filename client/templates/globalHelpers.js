Template.registerHelper('centeredColumn', () => {
  return 'col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3';
});

Template.registerHelper('centeredColumnSmall', () => {
  return 'col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3';
});

Template.registerHelper('humanDate', (date) => {
  return moment(date).format('MMM Do');
});

Template.registerHelper('weekStart', () => {
  return moment().day(1).toDate();
});

Template.registerHelper('weekEnd', () => {
  return moment().day(8).toDate();
});

Template.registerHelper('isAdmin', () => {
  const instance = Template.instance();
  if (instance.data.group)
    return instance.data.group.userIsAdmin();
  return false;
});
