Vacations = new Meteor.collection('vacations');

Vacations.methods = {};

Vacations.schema = new SimpleSchema({
  startDate: {
    type: Date,
    label: 'Start Date'
  },
  endDate: {
    type: Date,
    label: 'End Date'
  },
  userId: {
    type: String,
    label: 'User',
    regEx: SimpleSchema.RegEx.Id
  }
});

Vacations.attachSchema(Vacations.schema);

Vacations.helpers({
  daysGoneInRange: (start, end) => {
    if (start < end) {
      const numMsPerDay = (1000*60*60*24);
      if (this.startDate > end)
        return 0;
      if (this.endDate < start)
        return 0;
      if (this.startDate < start) {
        if (this.endDate < end) {
          return (this.endDate - start) / numMsPerDay;
        }
        else {
          return (end - start) / numMsPerDay;
        }
      }
      if (this.endDate > end) {
        return (end - this.startDate) / numMsPerDay;
      }
      return (this.endDate - this.startDate) / numMsPerDay;
    }
    return 0;
  }
});
