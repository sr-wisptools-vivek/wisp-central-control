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

    var type = event.target.typeName.value;
    var given = event.target.givenWhen.value;

    WtPowercodeCommission.collection.type.insert({name: type, givenWhen: given});

    event.target.typeName.value = "";
  }
});


Template.wtPowercodeCommissionTypesEdit.events({
  "submit .save-type": function (event) {
    event.preventDefault();

    var _id = this._id
    var type = event.target.typeName.value;
    var given = event.target.givenWhen.value;

    WtPowercodeCommission.collection.type.updateFeild(_id, {name: type, givenWhen: given});

  }
});
