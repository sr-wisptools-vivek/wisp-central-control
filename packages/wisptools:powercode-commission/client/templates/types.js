Template.wtPowercodeCommissionTypes.helpers({
  typeList: function () {
    return WtPowercodeCommission.collection.type.find({deleted: {$ne: true}}).fetch();
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});

Template.wtPowercodeCommissionTypesEdit.helpers({
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  }
});


Template.wtPowercodeCommissionTypes.events({
  "submit .add-type": function (event) {
    event.preventDefault();
    event.stopPropagation();

    var type = event.target.typeName.value;
    var given = event.target.givenWhen.value;

    WtPowercodeCommission.collection.type.insert({name: type, givenWhen: given});

    event.target.typeName.value = "";
  }
});


Template.wtPowercodeCommissionTypesEdit.events({
  "submit .save-type": function (event) {
    event.preventDefault();
    event.stopPropagation();

    var _id = this._id
    var type = event.target.typeName.value;
    var given = event.target.givenWhen.value;

    WtPowercodeCommission.collection.type.update(_id, {$set: {name: type, givenWhen: given}}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update commission type " + type);
      else
        WtGrowl.success("Commission type " + type + " updated");
    });

  }
});
