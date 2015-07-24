Template.wtPowercodeTaxReportEmail.helpers({
  typeList: function () {
    return WtPowercodeTaxReport.collection.email.find({deleted: {$ne: true}}).fetch();
  }
});

Template.wtPowercodeTaxReportEmailEdit.helpers({
});


Template.wtPowercodeTaxReportEmail.events({
  "submit .add-type": function (event) {
    event.preventDefault();
    event.stopPropagation();

    var email = event.target.taxReportEmail.value;

    WtPowercodeTaxReport.collection.email.insert({email: email});

    event.target.taxReportEmail.value = "";
  }
});


Template.wtPowercodeTaxReportEmailEdit.events({
  "submit .save-type": function (event) {
    event.preventDefault();
    event.stopPropagation();

    var _id = this._id
    var email = event.target.taxReportEmail.value;

    WtPowercodeTaxReport.collection.email.update(_id, {$set: {email: email}}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update email " + email);
      else
        WtGrowl.success("Email " + email + " updated");
    });

  }
});
