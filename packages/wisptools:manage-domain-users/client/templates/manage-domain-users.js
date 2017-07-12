Template.wtManageDomainUsers.onCreated(function () {
  this.domainUsers = new ReactiveVar(false);
});

Template.wtManageDomainUsers.onRendered(function () {
  var _this = this;
  Meteor.call('wtManageDomainUsersGetDomainUsers', function (err, res) {
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
  },
  'isEnabled': function () {
    if (this.profile && this.profile.disabled===true) {
      return false;
    }
    return true;
  },
  'isCurrentUser': function () {
    if (this._id === Meteor.userId()) {
      return true;
    }
    return false;
  }
});

Template.wtManageDomainUsers.events({
  'click .disableBtn': function () {
    var domainUsers = Template.instance().domainUsers;
    Meteor.call('wtManageDomainUsersDisableUser', this._id, function (e, r) {
      if (e) {
        WtGrowl.fail(e.message);
      } else {
        if (!r) {
          WtGrowl.fail('Failed to disable user.');
        } else {
          Meteor.call('wtManageDomainUsersGetDomainUsers', function (err, res) {
            if (!err && res && res.length>0) {
              domainUsers.set(res);
              WtGrowl.success('Disabled user.');
            }
          });
        }
      }
    });
  },
  'click .enableBtn': function () {
    var domainUsers = Template.instance().domainUsers;
    Meteor.call('wtManageDomainUsersEnableUser', this._id, function (e, r) {
      if (e) {
        WtGrowl.fail(e.message);
      } else {
        if (!r) {
          WtGrowl.fail('Failed to disable user.');
        } else {
          Meteor.call('wtManageDomainUsersGetDomainUsers', function (err, res) {
            if (!err && res && res.length>0) {
              domainUsers.set(res);
              WtGrowl.success('Enabled user.');
            }
          });
        }
      }
    });
  }
});
