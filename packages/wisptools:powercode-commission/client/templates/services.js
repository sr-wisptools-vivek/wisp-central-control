
Template.wtPowercodeCommissionServices.helpers({
  serviceList: function () {
    return Template.instance().serviceList.get();
  }
});

Template.wtPowercodeCommissionServices.created = function () {
  var self = this;
  // Initialize the reactive var to and empty array
  self.serviceList = new ReactiveVar([]);

  // Make a Meteor.method call and update the reactive var to the data from the result
  Meteor.call('wtPowercodeGetAllServices', function (err, res) {
    if (err)
      console.log(err)
    else {
      // Copy any missing services to mongo collection
      var len = res.length;
      for (var i = 0; i < len; i++) {
        var data = WtPowercodeCommission.collection.service.findOne({serviceId: res[i].ID});
        if (data == undefined) {
          data = {
            serviceId: res[i].ID,
            commissions: []
          }
          WtPowercodeCommission.collection.service.insert(data);
        }
      }
      self.serviceList.set(res);
    }
  });

}

Template.wtPowercodeCommissionServicesTypes.helpers({
  typeList: function () {
    return WtPowercodeCommission.collection.type.find({deleted: {$ne: true}}).fetch();
  },
  commission: function () {
    var _this = this;
    var powercodeService = Template.parentData(1);
    var data = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID, commissions: {$elemMatch: {typeId: _this._id}}}, {fields: {commissions: 1}});
    if (data == undefined) {
      commission = {
        typeId: _this._id,
        amount: 0,
        type: '%'
      }
      var service = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID});
      var res = WtPowercodeCommission.collection.service.update({_id: service._id}, {$push: {commissions: commission}});
      data = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID, commissions: {$elemMatch: {typeId: _this._id}}}, {fields: {commissions: 1}});
    }
    return _.find(data.commissions, function (com) {return com.typeId == _this._id});
  }
});

Template.wtPowercodeCommissionServicesTypes.events({
  "blur .comm-amount": function (event) {
    var _this = this;
    var powercodeService = Template.parentData(0);
    var data = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID, commissions: {$elemMatch: {typeId: _this._id}}}, {fields: {commissions: 1}});

    var len = data.commissions.length;
    for (var i = 0; i < len; i++) {
      if (data.commissions[i].typeId == _this._id) {
        data.commissions[i].amount = event.target.value;
      }
    }
    WtPowercodeCommission.collection.service.update(data._id, {$set: {commissions: data.commissions}}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update service");
      else
        WtGrowl.success("Amount updated to " + event.target.value);
    });
  },
  "blur .comm-perc": function(event) {
    var _this = this;
    var powercodeService = Template.parentData(0);
    var data = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID, commissions: {$elemMatch: {typeId: _this._id}}}, {fields: {commissions: 1}});

    var len = data.commissions.length;
    for (var i = 0; i < len; i++) {
      if (data.commissions[i].typeId == _this._id) {
        data.commissions[i].type = '%';
      }
    }
    WtPowercodeCommission.collection.service.update(data._id, {$set: {commissions: data.commissions}}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update service");
      else
        WtGrowl.success("Commissions set to %");
    });
  },
  "blur .comm-dollar": function(event) {
    var _this = this;
    var powercodeService = Template.parentData(0);
    var data = WtPowercodeCommission.collection.service.findOne({serviceId: powercodeService.ID, commissions: {$elemMatch: {typeId: _this._id}}}, {fields: {commissions: 1}});

    var len = data.commissions.length;
    for (var i = 0; i < len; i++) {
      if (data.commissions[i].typeId == _this._id) {
        data.commissions[i].type = '$';
      }
    }
    WtPowercodeCommission.collection.service.update(data._id, {$set: {commissions: data.commissions}}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update service");
      else
        WtGrowl.success("Commissions set to $");
    });
  }
});


