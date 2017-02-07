Template.wtUIAddress.onCreated(function () {
  this.displayAddr2 = new ReactiveVar(false);
});

Template.wtUIAddress.onRendered(function() {
  this.displayAddr2.set(false);
});

Template.wtUIAddress.helpers({
  addr: function () {
    if (!this.addressData) return {};
    return this.addressData;
  },
  selected: function(a, b) {
    return a == b ? 'selected' : '';
  },
  displayAddr2: function(add2) {
    return (add2 || Template.instance().displayAddr2.get());
  },
});

Template.wtUIAddress.events({
  'click .add2ndLine': function(e, t) {
    t.displayAddr2.set(true);
  },
});

