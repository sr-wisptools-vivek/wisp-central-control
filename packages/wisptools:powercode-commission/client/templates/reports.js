
//var Future = Npm.require('fibers/future');

Template.wtPowercodeCommissionReports.created = function () {
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
  },
  percentDone: function () {
    return Template.instance().percentDone.get();
  }
});

Template.wtPowercodeCommissionReports.events({
  "submit .run-comm-report": function (event) {

    event.preventDefault();
    event.stopPropagation();
    var self = Template.instance();
    self.running.set(true);
    self.percentDone.set(15);
    self.startDate.set(event.target.commStartDate.value);
    self.endDate.set(event.target.commEndDate.value);

    Meteor.call('wtPowercodeGetServicesSoldBySalesPersonAll', self.startDate.get(), self.endDate.get(), function (err, res) {
      var curSalesPerson;
      var curCommissionTypeId;
      var mRes; // for db results
      var rowCount = res.length;
      var workingData = [];
      var workingIndex = 0;
      var balances = {};

      // Get commission rates and convert into quickly accessable format
      var services = {};
      mRes = WtPowercodeCommission.collection.service.find().fetch();
      var len = mRes.length;
      for (var i = 0; i < len; i++) {

        var serId = mRes[i].serviceId;
        services[serId] = {};

        var lenInner = mRes[i].commissions.length;
        for (var ii = 0; ii < lenInner; ii++) {
          var commission = {};
          commission.amount = mRes[i].commissions[ii].amount;
          commission.type = mRes[i].commissions[ii].type;
          services[serId][mRes[i].commissions[ii].typeId] = commission;
        }

      }

      for (var i = 0; i < rowCount; i++) {

        // Update the user commission group as it changes.
        if (curSalesPerson != res[i].SalesPerson) {
          curSalesPerson = res[i].SalesPerson;
          mRes = WtPowercodeCommission.collection.user.findOne({'webUsername': curSalesPerson});
          if (! mRes) {
            curCommissionTypeId = null;
          } else {
            curCommissionTypeId = mRes.commissionTypeId;
          }
        }


        // Do we have a commission to give?
        if (! services[res[i].ServiceID] ) { continue; }
        if (! services[res[i].ServiceID][curCommissionTypeId] ) { continue; }
        if (Number(services[res[i].ServiceID][curCommissionTypeId].amount) == 0) { continue; }

        if (! balances[res[i].CustomerID]) balances[res[i].CustomerID] = {};
        if (! balances[res[i].CustomerID][res[i].Date]) balances[res[i].CustomerID][res[i].Date] = [];
        balances[res[i].CustomerID][res[i].Date].push(workingIndex);
        res[i].isPaidUp = "UNK";
        if (services[res[i].ServiceID][curCommissionTypeId].type == '%') {
          res[i].commission = numeral(Number(res[i].Amount) * (Number(services[res[i].ServiceID][curCommissionTypeId].amount) / 100.00)).format('$0,0.00');
        } else {
          res[i].commission = numeral(Number(services[res[i].ServiceID][curCommissionTypeId].amount)).format('$0,0.00');
        }
        res[i].Amount = numeral(res[i].Amount).format('$0,0.00');

        workingData.push(res[i]);
        workingIndex++;
      }

      self.percentDone.set(75);
      self.reportData.set(workingData);

      _.each(balances, function(dates, customerId) {
        _.each(dates, function(indexs, date) {
          Meteor.call('wtPowercodePaidUpBalance', customerId, date, function (err, res) {
            if (err) return;
            var paid;
            if (Number(res[0].balance) <= 0) {
              paid = "Yes";
            } else {
              paid = "No";
            }
            var len = indexs.length;
            for (var i = 0; i < len; i++) {
              workingData[indexs[i]].isPaidUp = paid;
            }
            self.reportData.set(workingData); // Update the data         
          });
        });
      });


      self.running.set(false);
    });

  }
});
