Template.newTask.helpers({
  weight: () => {
    const weightArray = [];
    for (let i=1; i<11; i++) {
      let weight = {
        label: i,
        value: i
      };
      if (i==3) weight.selected = true;
      weightArray.push(weight);
    }
    return weightArray;
  },
  dpOptions: () => {
   return {
     startDate: new Date()
    };
  }
});
