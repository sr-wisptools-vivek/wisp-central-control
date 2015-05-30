
//var Future = Npm.require('fibers/future');

Template.wtPowercodeTaxReport.created = function () {
  var self = this;
  self.reportData = new ReactiveVar([]);
  self.running = new ReactiveVar(false);
  self.percentDone = new ReactiveVar(0);

  var defaultEnd = new Date(); // temp use for setting start date
  var defaultStart = new Date(defaultEnd.getFullYear(), defaultEnd.getMonth() - 1, 1); // set to first of previous month
  defaultEnd.setDate(1); // move to the first of current month
  defaultEnd.setHours(-1); // back the hour off to the previos day, or the last day of the previos month

  self.startDate = new ReactiveVar(WtDateFormat(defaultStart, "shortDate"));
  self.endDate = new ReactiveVar(WtDateFormat(defaultEnd, "shortDate"));
}

Template.wtPowercodeTaxReport.rendered=function() {
    $('#taxStartDate').datepicker();
    $('#taxEndDate').datepicker();
}

Template.wtPowercodeTaxReport.helpers({
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
  },
  percentDone: function () {
    return Template.instance().percentDone.get();
  }
});

Template.wtPowercodeTaxReport.events({
  "submit .run-report-tax": function (event) {

    event.preventDefault();
    event.stopPropagation();
    var self = Template.instance();
    self.running.set(true);
    self.percentDone.set(15);
    self.startDate.set(event.target.taxStartDate.value);
    self.endDate.set(event.target.taxEndDate.value);

    Meteor.call('wtPowercodeGetTaxReport', self.startDate.get(), self.endDate.get(), function (err, res) {
      self.reportData.set(res);
      self.running.set(false);
    });

  }
});
