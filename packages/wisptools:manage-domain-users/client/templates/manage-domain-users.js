Template.wtManageDomainUsers.onCreated(function () {
  this.domainUsers = new ReactiveVar(false);
});

Template.wtManageDomainUsers.onRendered(function () {
  var _this = this;
  Meteor.call('wtManageUserDomainsGetDomainUsers', function (err, res) {
    if (!err && res && res.length>0) {
      _this.domainUsers.set(res);
    }
  });
});

Template.wtManageDomainUsers.helpers({
  'domainUsers': function () {
    return Template.instance().domainUsers.get();
  },
  'email': function () {
    if (this.emails && this.emails.length>0) {
      return this.emails[0].address;
    }
    return '';
  }
});
