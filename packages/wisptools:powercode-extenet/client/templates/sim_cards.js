
Template.wtPowercodeSIMCards.helpers({
  inventoryProducts: function () {
    return Template.instance().inventoryList.get();
  }
});

Template.wtPowercodeSIMCards.created = function () {
  var self = this;
  // Initialize the reactive var to and empty array
  self.inventoryList = new ReactiveVar([]);

  // Make a Meteor.method call and update the reactive var to the data from the result
  Meteor.call('wtPowercodeGetAllInvProducts', function (err, res) {
    if (err)
      console.log(err)
    else {
      // Copy any missing products to mongo collection
      var len = res.length;
      for (var i = 0; i < len; i++) {
        var data = WtPowercodeExtenet.collection.card.findOne({productId: res[i].ID});
        if (data == undefined) {
          data = {
            productId: res[i].ID,
            isSimCard: "No",
            autoSyncInventory: false
          }
          WtPowercodeExtenet.collection.card.insert(data);
        }
      }
      self.inventoryList.set(res);
    }
  });

}

Template.wtPowercodeSIMCardsSettings.helpers({
  simCard: function () {
    var _this = this;
    return WtPowercodeExtenet.collection.card.findOne({productId: _this.ID});
  },
  selected: function (a, b) {
    return a == b ? 'selected' : '';
  },
  checked: function (a) {
    return a ? 'checked' : '';
  },
  showAutoSync: function () {
    return this.isSimCard == "Yes" ? true : false;
  }
});


Template.wtPowercodeSIMCardsSettings.events({
  "change .is-sim-select": function (event) {
    var productContext = Template.parentData(0);
    var product = WtPowercodeExtenet.collection.card.findOne({productId: productContext.ID});
    var data = {
      isSimCard: event.target.value
    }
    WtPowercodeExtenet.collection.card.update(product._id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could not update " + productContext.Name + " product");
      else
        WtGrowl.success("Is Sim changed for " + productContext.Name);
    });
  },
  "change .auto-sync-sim-check": function (event) {
    var productContext = Template.parentData(0);
    var product = WtPowercodeExtenet.collection.card.findOne({productId: productContext.ID});
    //only one product can has auto sync
    if (event.target.checked) {
      var data = { autoSyncInventory: false };
      // can only do updates by id...  Still learning about Meteor, might be a better way.
      var res = WtPowercodeExtenet.collection.card.find().fetch();
      var len = res.length;
      for (var i = 0; i < len; i++) {
        WtPowercodeExtenet.collection.card.update(res[i]._id, {$set: data});
      }
    }

    var data = {
      autoSyncInventory: event.target.checked
    }
    WtPowercodeExtenet.collection.card.update(product._id, {$set: data}, {}, function (err, res) {
      if (err)
        WtGrowl.fail("Could update auto sync for " + productContext.Name + " product");
      else
        WtGrowl.success("Auto sycn changed for " + productContext.Name);
    });
  }
});

