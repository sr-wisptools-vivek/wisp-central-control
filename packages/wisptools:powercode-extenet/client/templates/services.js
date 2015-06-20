
Template.wtPowercodeExteNetServices.helpers({
  monthlyServices: function () {
    return Template.instance().serviceList.get();
  }
});

Template.wtPowercodeExteNetServices.created = function () {
  var self = this;
  // Initialize the reactive var to and empty array
  self.serviceList = new ReactiveVar([]);

  // Make a Meteor.method call and update the reactive var to the data from the result
  Meteor.call('wtPowercodeGetAllMonthlyServices', function (err, res) {
    if (err)
      console.log(err)
    else {
      // Copy any missing services to mongo collection
      var len = res.length;
      for (var i = 0; i < len; i++) {
        var data = WtPowercodeExtenet.collection.service.findOne({serviceId: res[i].ID});
        if (data == undefined) {
          data = {
            serviceId: res[i].ID,
            isLte: "No",
            profile: ""
          }
          WtPowercodeExtenet.collection.service.insert(data);
        }
      }
      self.serviceList.set(res);
    }
  });

}

Template.wtPowercodeExteNetServiceSettings.helpers({
  service: function () {
    var _this = this;
    return WtPowercodeExtenet.collection.service.findOne({serviceId: _this.ID});
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  },
  showProfile: function () {
    return this.isLte == "Yes" ? true : false;
  }
});


Template.wtPowercodeExteNetServiceSettings.events({
  "change .is-lte-select": function (event) {
    var serviceContext = Template.parentData(0);
    var service = WtPowercodeExtenet.collection.service.findOne({serviceId: serviceContext.ID});
    var data = {
      isLte: event.target.value
    }
    WtPowercodeExtenet.collection.service.update(service._id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update LTE setting " + serviceContext.Description + "service");
      else
        WtGrowl.success("Is LTE changed for " + serviceContext.Description);
    });
  },
  "blur .lte-profile-input": function (event) {
    var serviceContext = Template.parentData(0);
    var service = WtPowercodeExtenet.collection.service.findOne({serviceId: serviceContext.ID});
    var data = {
      profile: event.target.value
    }
    WtPowercodeExtenet.collection.service.update(service._id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update LTE setting " + serviceContext.Description + "service");
      else
        WtGrowl.success("LTE profile changed for " + serviceContext.Description);
    });
  }
});

