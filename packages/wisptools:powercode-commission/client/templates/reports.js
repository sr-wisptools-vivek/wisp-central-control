
Template.wtPowercodeCommissionReports.created = function () {
  var self = this;
  self.reportData = new ReactiveVar([]);
  self.running = new ReactiveVar(false);

  var defaultEnd = new Date(); // temp use for setting start date
  var defaultStart = new Date(defaultEnd.getFullYear(), defaultEnd.getMonth() - 1, 1); // set to first of previous month
  defaultEnd.setDate(1); // move to the first of current month
  defaultEnd.setHours(-1); // back the hour off to the previos day, or the last day of the previos month

  self.startDate = new ReactiveVar(WtDateFormat(defaultStart, "shortDate"));
  self.endDate = new ReactiveVar(WtDateFormat(defaultEnd, "shortDate"));
}

Template.wtPowercodeCommissionReports.rendered=function() {
    $('#commStartDate').datepicker();
    $('#commEndDate').datepicker();
}

Template.wtPowercodeCommissionReports.helpers({
  reportData: function () {
    return Template.instance().reportData.get();
  },
  running: function () {
    return Template.instance().running.get();
  },
  disabled: function () {
    return Template.instance().running.get() ? 'disabled' : '';
  },
  haveData: function () {
    return Template.instance().reportData.get().length === 0 ? true : false;
  },
  startDate: function () {
    return Template.instance().startDate.get();
  },
  endDate: function () {
    return Template.instance().endDate.get();
  }
});

Template.wtPowercodeCommissionReports.events({
  "submit .run-report": function (event) {

    event.preventDefault();
    event.stopPropagation();
    Template.instance().running.set(true);

    var data = [
      {
        'user': 'sam',
        'customer': 'Joe Smith',
        'commission': '$5.00'
      },
      {
        'user': 'sam',
        'customer': 'Jane Fonda',
        'commission': '$5.00'
      },
      {
        'user': 'sam',
        'customer': 'Rusty Bolt',
        'commission': '$15.00'
      },
      {
        'user': 'jimmy',
        'customer': 'Nancy R',
        'commission': '$3.00'
      },
      {
        'user': 'jimmy',
        'customer': 'Nick ',
        'commission': '$5.00'
      }
    ];

    Template.instance().reportData.set(data);
    Template.instance().running.set(false);

    /*
    var _id = this._id
    var type = event.target.typeName.value;
    var given = event.target.givenWhen.value;

    //WtPowercodeCommission.collection.type.update(_id, {$set: {name: type, givenWhen: given}}, {}, function (err, res) {
    */
  }
});