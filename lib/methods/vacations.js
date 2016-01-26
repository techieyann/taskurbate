Vacations.methods.newVacation = new ValidatedMethod({
  name: 'Vacations.methods.newVacation',
  validate: new SimpleSchema({
    start: {type: Date},
    end: {type: Date}
  }).validator(),
  run({ start, end }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Vacations.methods.newVacation.notLoggedIn',
        'Not logged in',
        'Must be logged in to create vacation'
      );
    }
    if (start < end) {
      throw new Meteor.Error(
        'Vacations.methods.newVacation.dateInsanity',
        'Dates must be chronological',
        'Can not end vacation before it starts'
      );
    }
    if (start < end) {
      throw new Meteor.Error(
        'Vacations.methods.newVacation.dateEquivalence',
        'Dates must be different',
        'Vacations must have a duration'
      );
    }
    if (Vacations.findOne({userId: this.userId, startDate: {$lt: end}, endDate: {$gt: start}})) {
      throw new Meteor.Error(
        'Vacations.methods.newVacation.alreadyVacationing',
        'Date overlap of existing vacation',
        'You are already vacationing in this date range'
      );
    }
    const vacation = {
      startDate: start,
      endDate: end,
      userId: this.userId
    };
    return Vacations.insert(vacation);
  }
});

Vacations.methods.editVacation = new ValidatedMethod({
  name: 'Vacations.methods.editVacation',
  validate: new SimpleSchema({
    vacationId: {type: String},
    start: {type: Date},
    end: {type: Date}
  }).validator(),
  run({ vacationId, start, end }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.notLoggedIn',
        'Not logged in',
        'Must be logged in to edit vacation'
      );
    }
    if (start < end) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.badRange',
        'Dates must be chronological',
        'Can not end vacation before it starts'
      );
    }
    if (start == end) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.dateEquivalence',
        'Dates must be different',
        'Vacations must have a duration'
      );
    }
    if (Vacations.findOne({_id: {$ne: vacationId}, userId: this.userId, startDate: {$lt: end}, endDate: {$gt: start}})) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.alreadyVacationing',
        'Date overlap of existing vacation',
        'You are already vacationing in this date range'
      );
    }
    
    const vacation = Vacations.find(vacationId);
    if (!vacation) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.unknownId',
        'unknown vacationId',
        'Can not find specified vacation'
      );
    }
    if (vacation.userId != this.userId) {
      throw new Meteor.Error(
        'Vacations.methods.editVacation.unauthorized',
        'Not vacation owner',
        'Can not edit someone else\'s vacation'
      );
    }
    const vacationEdit = {
      startDate: start,
      endDate: end
    };
    return Vacations.update(vacationId, vacationEdit);
  }
});

Vacations.methods.deleteVacation = new ValidatedMethod({
  name: 'Vacations.methods.deleteVacation',
  validate: new SimpleSchema({
    vacationId: {type: String}
  }).validator(),
  run({ vacationId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'Vacations.methods.deleteVacation.notLoggedIn',
        'Not logged in',
        'Must be logged in to delete vacation'
      );
    }
    const vacation = Vacations.find(vacationId);
    if (!vacation) {
      throw new Meteor.Error(
        'Vacations.methods.deleteVacation.unknownId',
        'unknown vacationId',
        'Can not find specified vacation'
      );
    }
    if (vacation.userId != this.userId) {
      throw new Meteor.Error(
        'Vacations.methods.deleteVacation.unauthorized',
        'Not vacation owner',
        'Can not delete someone else\'s vacation'
      );
    }
    Vacations.remove(vacationId);
  }
});
