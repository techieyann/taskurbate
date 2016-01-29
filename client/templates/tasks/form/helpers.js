Template.taskForm.helpers({
  formTitle: function (mode) {
    return (mode == 'new' ? 'Create new task:' : 'Edit task:');
  },
  taskFormAttributes: function (mode) {
    const attributes = {
      id: 'taskForm',
      collection: 'Tasks',
      meteormethod: 'Tasks.methods.'+mode+'Task',
      type: 'method'
    };
    if (mode == 'edit') {
      attributes.type += '-update';
      attributes.doc = Template.instance().data.task;
      attributes.singleMethodArgument = true;
    }
    console.log(attributes);
    return attributes;
  },
  weight: () => {
    const weightArray = [];
    const task = Template.instance().data.task;
    for (let i=1; i<11; i++) {
      let weight = {
        label: i,
        value: i
      };
      if (i==task.weight) weight.selected = true;
      weightArray.push(weight);
    }
    return weightArray;
  },
  dpOptions: () => {
   return {
     startDate: new Date()
    };
  },
  dateValue: function (mode) {
    return (
      mode == 'new' ? 
        new Date() :
        Template.instance().data.task.due
    );
  },
  period: function (mode) {
    return (
      mode == 'new' ?
        1 :
        Template.instance().data.task.period / (1000 * 60 * 60 * 24)
    );
  },
  formIcon: function (mode) {
    return (mode == 'new' ? 'plus' : 'save');
  },
  formAction: function (mode) {
    return (mode == 'new' ? 'Create' : 'Save');
  }
});
